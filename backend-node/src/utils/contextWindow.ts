/**
 * Context Window Manager
 * 
 * Maintains a bounded rolling context window per conversation_id.
 * Stores the last 3-4 conversational turns (6-8 messages max).
 */

export interface ContextMessage {
    role: 'user' | 'assistant';
    content: string;
}

// In-memory store keyed by conversation_id
const contextStore = new Map<string, ContextMessage[]>();

// Max messages to keep (4 turns = 8 messages)
const MAX_MESSAGES = 8;

/**
 * Get the current context window for a conversation.
 * Returns an empty array if no context exists.
 */
export function getContextWindow(conversationId: string): ContextMessage[] {
    return contextStore.get(conversationId) || [];
}

/**
 * Append a message to the context window.
 * Automatically trims oldest messages if window exceeds MAX_MESSAGES.
 */
export function appendToContextWindow(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
): void {
    const current = contextStore.get(conversationId) || [];

    current.push({ role, content });

    // Trim oldest messages if exceeding limit
    while (current.length > MAX_MESSAGES) {
        current.shift();
    }

    contextStore.set(conversationId, current);
}

/**
 * Clear context for a conversation (optional utility).
 */
export function clearContextWindow(conversationId: string): void {
    contextStore.delete(conversationId);
}
