"""
Pinecone retriever for RAG queries.
Uses BAAI/bge-m3 model for embeddings to match the Pinecone index (1024 dimensions).
"""

from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from app.core.config import get_settings

# Load embedding model once (cached)
_embedding_model = None

def get_embedding_model():
    """Get or load the BGE-M3 embedding model (1024 dimensions)."""
    global _embedding_model
    if _embedding_model is None:
        # Use the full BGE-M3 model to match Pinecone index dimensions (1024)
        _embedding_model = SentenceTransformer('BAAI/bge-m3')
    return _embedding_model


def get_embedding(text: str) -> list[float]:
    """
    Generate embedding for text using BGE-M3 model.
    Produces 1024-dimensional vectors matching the Pinecone index.
    """
    model = get_embedding_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


def query_pinecone(
    query: str,
    top_k: int = 5
) -> tuple[list[dict], float | None]:
    """
    Query Pinecone index for relevant context.
    
    Args:
        query: User's message
        top_k: Number of results to retrieve
    
    Returns:
        Tuple of (matches list, highest score or None)
        Each match contains: id, score, metadata
    """
    settings = get_settings()
    
    # Initialize Pinecone client
    pc = Pinecone(api_key=settings.pinecone_api_key)
    index = pc.Index(settings.pinecone_index)
    
    # Generate query embedding
    query_embedding = get_embedding(query)
    
    # Query Pinecone
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    matches = results.get("matches", [])
    
    if not matches:
        return [], None
    
    # Extract highest score
    highest_score = max(match.get("score", 0) for match in matches)
    
    return matches, highest_score


def get_context_from_matches(
    matches: list[dict],
    threshold: float
) -> tuple[str, list[dict]]:
    """
    Extract context text and sources from Pinecone matches.
    
    Args:
        matches: Raw Pinecone match results
        threshold: Minimum score to include
    
    Returns:
        Tuple of (concatenated context string, list of source metadata)
    """
    context_parts = []
    sources = []
    
    for match in matches:
        score = match.get("score", 0)
        
        if score < threshold:
            continue
        
        metadata = match.get("metadata", {})
        text = metadata.get("text", "")
        
        if text:
            context_parts.append(text)
            sources.append({
                "title": metadata.get("title", "Unknown"),
                "source": metadata.get("source", "Unknown"),
                "score": round(score, 3)
            })
    
    context = "\n\n---\n\n".join(context_parts)
    return context, sources
