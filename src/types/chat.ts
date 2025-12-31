export type Role = 'user' | 'assistant' | 'system';

export type InteractionMode = 'think' | 'search' | 'canvas' | 'default';

export interface Block {
  type: 'heading' | 'paragraph' | 'list' | 'numbered_list' | 'code' | 'quote' | 'divider';
  content?: string;
  items?: string[]; // for lists
  language?: string; // for code
}

export interface Message {
  id: string;
  role: Role;
  content: string; // Stored as JSON string for assistant, plain text for user
  reasoning?: string[]; // Array of reasoning steps
  mode?: InteractionMode;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  summary?: string[]; // Conversation summary bullet points
  createdAt: number;
  updatedAt: number;
}
