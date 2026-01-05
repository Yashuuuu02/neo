# Chatbot Spline - Python Backend (Legacy)

> [!WARNING]
> This backend implementation is **DEPRECATED** and is kept for reference purposes only. The active backend is located in `../backend-node`.

This directory contains the original Python/FastAPI implementation of the chatbot backend.

## Structure

- `app/`: Application source code.
- `requirements.txt`: Python dependencies.

## Setup (Reference)

If you need to run this legacy backend:

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server (typically with Uvicorn):
   ```bash
   uvicorn app.main:app --reload
   ```
