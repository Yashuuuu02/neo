import type { InteractionMode, Block } from '@/types/chat';

export function detectIntent(message: string): { mode: InteractionMode; cleanMessage: string } {
  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();

  if (trimmed.startsWith("[Think:]")) {
    return { mode: 'think', cleanMessage: trimmed.replace("[Think:]", "").trim() };
  }
  if (trimmed.startsWith("[Search:]")) {
    return { mode: 'search', cleanMessage: trimmed.replace("[Search:]", "").trim() };
  }
  if (trimmed.startsWith("[Canvas:]")) {
    return { mode: 'canvas', cleanMessage: trimmed.replace("[Canvas:]", "").trim() };
  }

  if (lower.includes("i'm bored") || lower.includes("im bored") || lower === "bored") {
    return { mode: 'default', cleanMessage: trimmed }; // Special case handled in response generation logic or we can add a 'bored' mode. Let's keep default but handle content.
  }

  return { mode: 'default', cleanMessage: trimmed };
}

export function generateTitle(message: string): string {
  let textContent = message;

  // Handle JSON blocks format - extract actual text content
  if (message.trim().startsWith('{') && message.includes('blocks')) {
    try {
      const parsed = JSON.parse(message);
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        // Extract content from blocks
        const contents: string[] = [];
        for (const block of parsed.blocks) {
          if (block.content && typeof block.content === 'string') {
            contents.push(block.content);
          }
          if (block.items && Array.isArray(block.items)) {
            contents.push(...block.items);
          }
        }
        textContent = contents.join(' ');
      }
    } catch {
      // Not valid JSON, use as-is
    }
  }

  const clean = textContent.replace(/\[.*?\]/g, "").trim();
  const words = clean.split(' ').slice(0, 5);
  const title = words.join(' ');
  return title.length > 0 ? title.charAt(0).toUpperCase() + title.slice(1) : "Untitled Thought";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

interface SimulatedResponse {
  content: string; // JSON string
  reasoning?: string[];
}

export function generateSystemResponse(userMessage: string, mode: InteractionMode): SimulatedResponse {
  const lower = userMessage.toLowerCase();
  const isBored = lower.includes("i'm bored") || lower.includes("im bored") || lower === "bored";

  // 1. Boredom Mode
  if (isBored) {
    const activity = {
      title: "Analyze the texture of a nearby object",
      why: "It forces you to shift from internal noise to external observation, grounding your attention immediately.",
      steps: ["Find an object (wood, fabric, metal).", "Close your eyes and touch it for 30 seconds.", "Describe the texture in your mind without naming the object."]
    };

    const blocks: Block[] = [
      { type: 'heading', content: activity.title },
      { type: 'paragraph', content: activity.why },
      { type: 'numbered_list', items: activity.steps },
      { type: 'paragraph', content: "Let me know what you find, or if you want another observation task." }
    ];

    return { content: JSON.stringify({ blocks }) };
  }

  // 2. Think Mode
  if (mode === 'think') {
    const reasoning = [
      "Analyze user input for core constraints",
      "Identify potential ambiguities in the request",
      "Evaluate optimal response structure",
      "Formulate detailed explanation"
    ];

    const blocks: Block[] = [
      { type: 'heading', content: 'Analysis' },
      { type: 'paragraph', content: `I have engaged deep reasoning to address your thought: "${userMessage}".` },
      { type: 'paragraph', content: "Here is the structural breakdown of the concept:" },
      { type: 'list', items: ["Core Axiom: Definition of the problem space.", "Variable A: Contextual constraints.", "Variable B: Desired outcome."] },
      { type: 'divider' },
      { type: 'paragraph', content: "Conclusion: The approach requires a systematic reduction of noise." }
    ];

    return { content: JSON.stringify({ blocks }), reasoning };
  }

  // 3. Code/Technical (Heuristic)
  if (lower.includes("code") || lower.includes("function") || lower.includes("react")) {
    const blocks: Block[] = [
      { type: 'paragraph', content: "Here is the implementation of the requested pattern." },
      { type: 'code', language: 'typescript', content: `function example() {\n  return "This is a structured response.";\n}` },
      { type: 'paragraph', content: "Note how the structure allows for clear separation of concerns." }
    ];
    return { content: JSON.stringify({ blocks }) };
  }

  // 4. Default Standard Response
  const blocks: Block[] = [
    { type: 'paragraph', content: "I understand. Let's explore this idea further." },
    { type: 'quote', content: "Clarity is the counter-balance to complexity." },
    { type: 'paragraph', content: "We should consider the following aspects:" },
    { type: 'list', items: ["Immediate implications", "Long-term sustainability", "Hidden externalities"] }
  ];

  return { content: JSON.stringify({ blocks }) };
}
