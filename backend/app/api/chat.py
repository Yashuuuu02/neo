"""
Chat API endpoint.
Single endpoint handling both general and RAG modes.
Uses OpenRouter for LLM calls (OpenAI-compatible API).
"""

from fastapi import APIRouter
from openai import OpenAI
import uuid
import traceback

from app.schemas.chat import ChatRequest, ChatResponse, Block
from app.core.config import get_settings
from app.rag.router import detect_mode, should_use_rag
from app.rag.retriever import query_pinecone, get_context_from_matches
from app.rag.prompt import get_general_prompt, get_rag_prompt
from app.utils.block_formatter import (
    parse_llm_json_response,
    create_fallback_response,
    create_error_response,
    format_sources
)

router = APIRouter()


def call_llm(system_prompt: str, user_message: str) -> str:
    """
    Call OpenRouter API (OpenAI-compatible).
    """
    settings = get_settings()
    
    # OpenRouter uses OpenAI-compatible client with custom base URL
    client = OpenAI(
        api_key=settings.openrouter_api_key,
        base_url=settings.openrouter_base_url
    )
    
    response = client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=settings.llm_temperature,
        # Note: Some models may not support json_object format
        # response_format={"type": "json_object"}
    )
    
    return response.choices[0].message.content or ""


@router.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint.
    
    Flow:
    1. Detect mode (general, rag_strong, rag_weak)
    2. If potential RAG: query Pinecone
    3. Decide final mode based on Pinecone scores
    4. Generate response with appropriate prompt
    5. Return structured JSON blocks
    """
    settings = get_settings()
    request_id = str(uuid.uuid4())[:8]
    
    print(f"[{request_id}] Incoming request: {request.message[:50]}...")
    
    try:
        # Step 1: Detect intent/mode
        mode = detect_mode(request.message)
        print(f"[{request_id}] Detected mode: {mode}")
        
        # Step 2: Handle general mode (no RAG needed)
        if mode == "general":
            system_prompt = get_general_prompt()
            llm_response = call_llm(system_prompt, request.message)
            print(f"[{request_id}] LLM Response (General): {llm_response[:100]}...")
            
            blocks = parse_llm_json_response(llm_response)
            
            return ChatResponse(
                blocks=blocks,
                sources=[],
                mode="general",
                request_id=request_id
            )
        
        # Step 3: RAG candidate - query Pinecone
        matches, highest_score = query_pinecone(request.message)
        print(f"[{request_id}] Pinecone Stats: Matches={len(matches)}, HighScore={highest_score}")
        
        # Write to debug log file
        with open("debug.log", "a") as f:
            f.write(f"[{request_id}] Mode={mode}, Matches={len(matches)}, HighScore={highest_score}\n")

        # Step 4: Decide if RAG should be used
        use_rag = should_use_rag(
            mode=mode,
            pinecone_score=highest_score,
            threshold=settings.rag_similarity_threshold
        )
        
        if not use_rag:
            print(f"[{request_id}] RAG rejected (Score below threshold)")
            # Fallback: no relevant context found
            return create_fallback_response()
        
        # Step 5: Extract context and generate RAG response
        context, raw_sources = get_context_from_matches(
            matches,
            settings.rag_similarity_threshold
        )
        
        print(f"[{request_id}] Context Length: {len(context)}")
        
        if not context.strip():
            print(f"[{request_id}] Empty context after filtering")
            return create_fallback_response()
        
        # Generate grounded response
        system_prompt = get_rag_prompt(context)
        llm_response = call_llm(system_prompt, request.message)
        print(f"[{request_id}] LLM Response (RAG): {llm_response[:100]}...")
        
        blocks = parse_llm_json_response(llm_response)
        sources = format_sources(raw_sources)
        
        return ChatResponse(
            blocks=blocks,
            sources=sources,
            mode="rag",
            request_id=request_id
        )
        
    except Exception as e:
        # Log error in production (for now, return error response)
        print(f"[{request_id}] Chat API error: {e}")
        print(traceback.format_exc())
        return create_error_response(f"{str(e)} (ID: {request_id})")
