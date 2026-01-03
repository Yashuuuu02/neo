"""
Mode router for determining general chat vs RAG mode.
Implements two-tier keyword detection to avoid false positives.
"""

from typing import Literal


# Strong triggers - always activate RAG mode
STRONG_TRIGGERS = {
    "cogneoverse",
    "neo",
    "orion",
}

# Weak triggers - only activate RAG if Pinecone confirms relevance
WEAK_TRIGGERS = {
    "internal",
    "architecture", 
    "system",
    "project",
    "documentation",
    "docs",
}


def detect_mode(message: str) -> Literal["general", "rag_strong", "rag_weak"]:
    """
    Determine the routing mode based on message content.
    
    Returns:
        - "general": No RAG needed, use conversational AI
        - "rag_strong": Definite RAG query (strong keyword found)
        - "rag_weak": Potential RAG query (weak keyword found, needs Pinecone confirmation)
    """
    message_lower = message.lower()
    
    # Check strong triggers first
    for trigger in STRONG_TRIGGERS:
        if trigger in message_lower:
            return "rag_strong"
    
    # Check weak triggers
    for trigger in WEAK_TRIGGERS:
        if trigger in message_lower:
            return "rag_weak"
    
    return "general"


def should_use_rag(mode: str, pinecone_score: float | None, threshold: float) -> bool:
    """
    Final decision on whether to use RAG for response generation.
    
    Args:
        mode: The detected mode from detect_mode()
        pinecone_score: Highest similarity score from Pinecone (None if no results)
        threshold: Minimum score required for RAG activation
    
    Returns:
        True if RAG should be used, False for general chat
    """
    if mode == "general":
        return False
    
    if mode == "rag_strong":
        # Strong triggers always attempt RAG, but still need valid context
        return pinecone_score is not None and pinecone_score >= threshold
    
    if mode == "rag_weak":
        # Weak triggers need higher confidence from Pinecone
        return pinecone_score is not None and pinecone_score >= threshold
    
    return False
