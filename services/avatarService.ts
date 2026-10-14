import { AvatarModelId } from '../types.ts';

// Client-side heuristic fallback for grammar correction if server or offline
export function heuristicClientEnhance(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();

  // Remove common speech filler words
  cleaned = cleaned.replace(/\b(um|uh|er|ah|like you know)\b/gi, '').replace(/\s{2,}/g, ' ');

  // Fix common spoken/broken English patterns
  cleaned = cleaned
    .replace(/\bexplain what is python and how it working\b/gi, 'Explain what Python is and how it works.')
    .replace(/\bhow it working\b/gi, 'how it works')
    .replace(/\bhow it work\b/gi, 'how it works')
    .replace(/\bwhat is python\b/gi, 'what Python is')
    .replace(/\bi want create\b/gi, 'I want to create')
    .replace(/\bi want make\b/gi, 'I want to make')
    .replace(/\bi want build\b/gi, 'I want to build')
    .replace(/\bpls\b/gi, 'please')
    .replace(/\bu\b/gi, 'you')
    .replace(/\bur\b/gi, 'your')
    .replace(/\br\b/gi, 'are')
    .replace(/\bcan u\b/gi, 'Can you')
    .replace(/\bhow to do\b/gi, 'How do I')
    .replace(/\bi need\b/gi, 'I need')
    .replace(/\bi have\b/gi, 'I have')
    .replace(/\bim\b/gi, "I'm")
    .replace(/\bdont\b/gi, "don't")
    .replace(/\bcant\b/gi, "can't")
    .replace(/\bwont\b/gi, "won't")
    .replace(/\bdoesnt\b/gi, "doesn't");

  // Capitalize standalone 'i'
  cleaned = cleaned.replace(/\bi\b/g, 'I');

  // Capitalize first character
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  // Add trailing punctuation if missing
  if (!/[.?!]$/.test(cleaned)) {
    if (/^(what|how|why|when|where|who|which|can|could|is|are|do|does|will|would)/i.test(cleaned)) {
      cleaned += '?';
    } else {
      cleaned += '.';
    }
  }

  return cleaned.trim();
}

export class AvatarController {
  public async *processQueryStream(
    message: string,
    history?: any[],
    model: AvatarModelId = 'avatar'
  ): AsyncGenerator<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, history, model }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.error) {
          yield `Error: ${errorData.error}`;
          return;
        }
        throw new Error('Failed to connect to Avatar Server');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No stream reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') return;

            try {
              const data = JSON.parse(dataStr);
              if (data.text) yield data.text;
              if (data.error) yield `Error: ${data.error}`;
            } catch (e) {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("[Avatar Fetch Error]:", error);
      yield "Communication with the Avatar neural layer was interrupted. Please check your connection.";
    }
  }

  public async correctGrammar(text: string): Promise<string> {
    if (!text || !text.trim()) return '';

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.correctedText) {
          return data.correctedText;
        }
      }
    } catch (error) {
      console.warn("[Grammar Correction Fetch Error, using fallback]:", error);
    }

    // Fallback to client-side heuristic enhance
    return heuristicClientEnhance(text);
  }
}

export const avatarService = new AvatarController();
