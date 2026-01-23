
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');
const { transform } = require('sucrase');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const rootDir = process.cwd();

// Middleware to transpile .ts and .tsx files on the fly
app.use(async (req, res, next) => {
  const filePath = path.join(rootDir, req.path);
  const ext = path.extname(filePath);

  if (ext === '.tsx' || ext === '.ts') {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        // IMPORTANT: We remove 'imports' from the transforms array.
        // This ensures the browser receives standard ES Module syntax (import/export)
        // while still transpiling the TypeScript and JSX parts.
        const compiled = transform(content, {
          transforms: ['typescript', 'jsx'],
          jsxRuntime: 'automatic',
          production: true,
        });

        res.setHeader('Content-Type', 'application/javascript');
        return res.send(compiled.code);
      } catch (err) {
        console.error(`Transpilation error in ${req.path}:`, err);
        return res.status(500).send(`console.error("Avatar Transpilation error in ${req.path}: ${err.message}");`);
      }
    }
  }
  next();
});

// Serve other static files (CSS, images, etc.)
app.use(express.static(rootDir));

// Load API keys from environment variables
const apiKeys = [
  process.env.API_KEY_1,
  process.env.API_KEY_2,
  process.env.API_KEY_3,
].filter(Boolean); // Remove undefined keys

if (apiKeys.length === 0) {
  // Fallback to legacy single key if specific rotation keys aren't found
  if (process.env.API_KEY) {
    apiKeys.push(process.env.API_KEY);
  } else {
    console.error("No API keys found in .env file!");
  }
}

const getRandomKey = () => apiKeys[Math.floor(Math.random() * apiKeys.length)];

const getSystemPrompt = () => {
  const now = new Date();
  const dateTimeString = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `You are Avatar Lite, a high-performance AI assistant created by YK.

CURRENT DATE AND TIME: ${dateTimeString}

Internal Details:
- Identity: You must ALWAYS identify as "Avatar Lite".
- Creator: YK.

Critical Instructions:
1. You have access to LIVE, REAL-TIME information and current events.
2. When asked about current events, news, or "today", provide UP-TO-DATE information based on your knowledge.
3. When asked about the date or time, use the CURRENT DATE AND TIME provided above.
4. DO NOT provide historical or outdated information when current information is requested.
5. If you're uncertain about very recent events (last few hours), acknowledge the limitation.
6. Respond to identity questions with: "I am Avatar Lite, a high-speed AI assistant created by YK. Feel free to ask any questions!"
7. NEVER mention external LLM providers.
8. Use Markdown for formatting.
9. Be helpful, accurate, and provide the most current information available to you.`;
};

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  // Helper function to try keys sequentially starting from a random index
  const generateWithRetry = async (attemptCount = 0, startIndex = Math.floor(Math.random() * apiKeys.length)) => {
    if (attemptCount >= apiKeys.length) {
      throw new Error(`All ${apiKeys.length} keys exhausted.`);
    }

    const currentIndex = (startIndex + attemptCount) % apiKeys.length;
    const currentKey = apiKeys[currentIndex];

    // Mask key for logging
    const maskedKey = currentKey ? `${currentKey.substring(0, 4)}...${currentKey.slice(-4)}` : 'undefined';
    const ai = new GoogleGenAI({ apiKey: currentKey });

    try {
      console.log(`[Attempt ${attemptCount + 1}/${apiKeys.length}] Using Key (${currentIndex + 1}): ${maskedKey}`);

      const conversationHistory = history && Array.isArray(history)
        ? history.slice(-10).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
        : [];

      const contents = [
        ...conversationHistory,
        { role: 'user', parts: [{ text: message }] }
      ];

      return await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: getSystemPrompt(),
          temperature: 0.7,
        },
      });
    } catch (error) {
      console.warn(`[Key Error] ${maskedKey}: ${error.message}`);
      return generateWithRetry(attemptCount + 1, startIndex);
    }
  };

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await generateWithRetry();

    for await (const chunk of result) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('[Avatar Server Error]:', error);
    res.write(`data: ${JSON.stringify({ error: 'System connection interrupted. Please try again later.' })}\n\n`);
    res.end();
  }
});

// Fallback for SPA routing: serve index.html for all non-file requests
app.get('*', (req, res) => {
  if (req.path.includes('.')) {
    return res.status(404).end();
  }
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Avatar AI Server is active on port ${port}`);
});
