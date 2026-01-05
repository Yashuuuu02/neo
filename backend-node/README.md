# Chatbot Spline - Node.js Backend

This is the **Active** backend service for the Chatbot Spline application, built with Node.js, Express, and TypeScript. It handles the core logic, RAG (Retrieval-Augmented Generation) pipeline, and API endpoints.

## Features

- **API Endpoints**: RESTful API for chat interactions.
- **RAG Pipeline**: Integrates with Pinecone for vector search and Xenova transformers for local embeddings.
- **Streaming**: Supports streaming responses (e.g., SSE) for real-time chat.
- **TypeScript**: Typed codebase for better maintainability.

## Setup

### Prerequisites

- Node.js (v18+)
- Pinecone Account & API Key

### Installation

1. Navigate to the `backend-node` directory:
   ```bash
   cd backend-node
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the `backend-node` directory with the following variables:

```env
PORT=3000
PINECONE_API_KEY=your_pinecone_api_key
OPENAI_API_KEY=your_openai_api_key (if used)
# Add other necessary keys
```

### Running the Server

- **Development Mode**:
  ```bash
  npm run dev
  ```
  Runs with `nodemon` for hot-reloading.

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## API Documentation

- `POST /api/chat`: Main endpoint for sending messages. expects standard JSON payload.
- `GET /health`: Health check endpoint.

## Project Structure

- `src/`: Source code.
  - `controllers/`: Request handlers.
  - `services/`: Business logic (RAG, Embedding, LLM).
  - `routes/`: API route definitions.
  - `utils/`: Helper functions.
