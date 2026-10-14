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

// Load API keys from environment variables (supports API_KEY_1..3, API_KEY, GEMINI_API_KEY)
const apiKeys = [
  process.env.API_KEY_1,
  process.env.API_KEY_2,
  process.env.API_KEY_3,
  process.env.API_KEY,
  process.env.GEMINI_API_KEY,
].filter(Boolean); // Remove undefined keys

if (apiKeys.length === 0) {
  console.warn("No API keys found in environment or .env file!");
}

const getRandomKey = () => apiKeys[Math.floor(Math.random() * apiKeys.length)];

// Generate system prompts for standard Avatar vs Avatar 2.0
const getSystemPrompt = (model = 'avatar') => {
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

  if (model === 'avatar-2.0') {
    return `You are Genesis, an advanced high-performance AI assistant powered by the Avatar 2.0 model, created by YK.

CURRENT DATE AND TIME: ${dateTimeString}

Internal Details:
- Identity: You must ALWAYS identify as "Genesis".
- Model: You are powered by Avatar 2.0, the cutting-edge reasoning and analytical model created by YK.
- Specialty: Advanced coding, complex mathematics, algorithmic reasoning, and deep problem-solving.
- Creator: YK.

Critical Instructions:
1. You are specifically engineered for complex mathematics, advanced coding, algorithmic logic, and difficult problem-solving.
2. Provide rigorous, step-by-step thinking and proofs for mathematics, algorithms, scientific concepts, and logical puzzles.
3. For coding questions, write clean, robust, well-architected code with best practices, edge case handling, and in-depth explanations.
4. When asked about current events, news, or "today", provide UP-TO-DATE information based on your knowledge.
5. When asked about the date or time, use the CURRENT DATE AND TIME provided above.
6. Respond to identity questions with: "I am Genesis, powered by the advanced Avatar 2.0 model, created by YK. I specialize in complex mathematics, advanced coding, logical reasoning, and problem-solving. How can I assist you today?"
7. NEVER mention external LLM providers.
8. Use Markdown formatting, LaTeX-style mathematical notation where applicable, and clean syntax-highlighted code blocks.
9. Deliver authoritative, precise, and deeply helpful answers.`;
  }

  return `You are Genesis, a high-performance AI assistant powered by the Avatar 1.2 model, created by YK.

CURRENT DATE AND TIME: ${dateTimeString}

Internal Details:
- Identity: You must ALWAYS identify as "Genesis".
- Model: You are powered by the Avatar 1.2 model.
- Creator: YK.

Critical Instructions:
1. You have access to LIVE, REAL-TIME information and current events.
2. When asked about current events, news, or "today", provide UP-TO-DATE information based on your knowledge.
3. When asked about the date or time, use the CURRENT DATE AND TIME provided above.
4. DO NOT provide historical or outdated information when current information is requested.
5. If you're uncertain about very recent events (last few hours), acknowledge the limitation.
6. Respond to identity questions with: "I am Genesis, a high-speed AI assistant powered by the Avatar 1.2 model, created by YK. How can I help you today?"
7. NEVER mention external LLM providers.
8. Use Markdown for formatting.
9. Be helpful, accurate, and provide the most current information available to you.

**Persona & Style:**
- **Human-Like & Conversational:** Speak naturally, like a knowledgeable friend. Avoid robotic or overly formal phrasing. Use contractions (e.g., "I'm", "it's") and a warm tone.
- **Direct & Concise:** Answer the user's question directly. Don't add unnecessary implementations or preambles unless asked.
- **Engaging:** Use varied sentence structures and show genuine interest in helping.
- **No Formatting Overload:** Use bolding for emphasis, but don't over-structuring simple answers. Keep it readable and natural.`;
};

// Heuristic fallback for grammar correction and prompt enhancement
const heuristicEnhance = (text) => {
  if (!text) return '';
  let cleaned = text.trim();

  // Remove common speech filler words
  cleaned = cleaned.replace(/\b(um|uh|er|ah|like you know)\b/gi, '').replace(/\s{2,}/g, ' ');

  // Fix common broken English phrasing patterns
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
    .replace(/\bhow to do\b/gi, 'How do I do')
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
};

// Chat endpoint supporting both Avatar and Avatar 2.0
app.post('/api/chat', async (req, res) => {
  const { message, history, model } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const activeModel = model === 'avatar-2.0' ? 'avatar-2.0' : 'avatar';

  if (apiKeys.length === 0) {
    return res.status(500).json({
      error: 'No API keys configured on server. Please set API_KEY or GEMINI_API_KEY in your .env file.'
    });
  }

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
      console.log(`[Attempt ${attemptCount + 1}/${apiKeys.length}] [Model: ${activeModel}] Using Key (${currentIndex + 1}): ${maskedKey}`);

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

      const temperature = activeModel === 'avatar-2.0' ? 0.25 : 0.7;

      return await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: getSystemPrompt(activeModel),
          temperature: temperature,
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
    const userMessage = error.message?.includes('exhausted')
      ? 'Unable to connect. Please check your internet connection and refresh the page to try again.'
      : 'Connection interrupted. Please refresh the page and try again.';
    res.write(`data: ${JSON.stringify({ error: userMessage })}\n\n`);
    res.end();
  }
});

// Endpoint for automatic English grammar correction and prompt enhancement
app.post('/api/enhance-prompt', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const rawText = text.trim();

  // If no API keys configured, return heuristic enhanced text
  if (apiKeys.length === 0) {
    return res.json({ correctedText: heuristicEnhance(rawText) });
  }

  const systemInstruction = `You are an expert English grammar, spelling, and prompt enhancement engine for Genesis AI.
Your sole mission:
1. Transform the input text (which may contain spoken transcripts, broken English, grammatical mistakes, missing punctuation, informal colloquialisms, or awkward phrasing) into clear, natural, grammatically correct, and well-structured English.
2. STRICT CONSTRAINTS:
   - PRESERVE the user's exact original meaning, intent, technical terms, function/variable names, and details.
   - Improve sentence structure, punctuation, capitalization, spelling, and clarity.
   - DO NOT add new facts, suggestions, or assumptions that the user did not specify.
   - DO NOT answer or respond to the prompt.
   - Return ONLY the corrected English text with no quotes, commentary, preamble, or markdown formatting.`;

  const enhanceWithRetry = async (attemptCount = 0, startIndex = Math.floor(Math.random() * apiKeys.length)) => {
    if (attemptCount >= apiKeys.length) {
      throw new Error(`All keys exhausted.`);
    }

    const currentIndex = (startIndex + attemptCount) % apiKeys.length;
    const currentKey = apiKeys[currentIndex];
    const ai = new GoogleGenAI({ apiKey: currentKey });

    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            { role: 'user', parts: [{ text: `Correct and enhance the grammar of this prompt:\n\n${rawText}` }] }
          ],
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Enhancement timeout')), 9000))
      ]);

      const candidate = response.text ? response.text.trim() : '';
      return candidate || rawText;
    } catch (err) {
      console.warn(`[Enhance Key/Timeout]: ${err.message}`);
      if (attemptCount + 1 < apiKeys.length) {
        return enhanceWithRetry(attemptCount + 1, startIndex);
      }
      return heuristicEnhance(rawText);
    }
  };

  try {
    const correctedText = await enhanceWithRetry();
    const cleaned = correctedText.replace(/^["']|["']$/g, '').trim();
    return res.json({ correctedText: cleaned || rawText });
  } catch (error) {
    console.warn('[Prompt Enhancement Fallback]:', error.message);
    return res.json({ correctedText: heuristicEnhance(rawText) });
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
