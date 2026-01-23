
export class AvatarController {
  public async *processQueryStream(message: string, history?: any[]): AsyncGenerator<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok) {
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
      console.error("[Avatar Lite Fetch Error]:", error);
      yield "Communication with the Avatar Lite neural layer was interrupted. Please check your connection.";
    }
  }
}

export const avatarService = new AvatarController();
