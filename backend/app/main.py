"""
Neo Backend - FastAPI Application Entry Point

A hybrid chatbot backend supporting:
- General conversational AI
- RAG-grounded internal knowledge queries
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router

# Create FastAPI app
app = FastAPI(
    title="Neo Backend",
    description="Hybrid chatbot API with general chat and RAG modes",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat router
app.include_router(chat_router)


@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok"}
