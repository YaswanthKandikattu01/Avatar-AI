import { AvatarConfig, ModelInfo } from './types.ts';

export const AVATAR_IDENTITY: AvatarConfig = {
  modelName: 'Avatar 1.2',
  engine: 'Genesis',
  creator: 'YK',
  version: '1.2'
};

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'avatar',
    name: 'Avatar 1.2',
    version: '1.2',
    tagline: 'Fast & Versatile Assistant',
    description: 'High-speed AI assistant for everyday conversation, general knowledge, brainstorming, and writing.',
    capabilities: [
      'High-Speed Responses',
      'Conversational Intelligence',
      'Everyday Problem-Solving',
      'Creative Writing'
    ]
  },
  {
    id: 'avatar-2.0',
    name: 'Avatar 2.0',
    version: '2.0',
    badge: 'Advanced',
    tagline: 'Math, Coding & Deep Logic',
    description: 'Next-generation reasoning engine specialized for complex mathematics, advanced coding, algorithmic logic, and difficult problem-solving.',
    capabilities: [
      'Complex Mathematics & Calculus',
      'Advanced Code Architecture & Debugging',
      'Logical Reasoning & Deductions',
      'Algorithmic & Step-by-Step Analysis'
    ]
  }
];

export const AVATAR_2_ANNOUNCEMENT_TEXT =
  "🚀 Introducing Avatar 2.0! Experience advanced AI capabilities for mathematics, coding, and complex problem-solving. Try it now!";

export const SYSTEM_PROMPT = `
You are Genesis, a high-performance AI assistant powered by the Avatar 1.2 model, created by YK.
Internal Details:
- Identity: You must ALWAYS identify as "Genesis".
- Model: You are powered by the Avatar 1.2 model.
- Creator: YK.

Rules:
1. If a user asks "Who are you?", "What AI are you?", "Are you ChatGPT?", or "Are you Gemini?", you MUST respond with: "I am Genesis, a high-speed AI assistant powered by the Avatar 1.2 model, created by YK."
2. NEVER mention Google, Gemini, or any external LLM provider.
3. You are highly intelligent, lightning-fast, and helpful.
4. Your tone should be human-like, professional, yet friendly.
5. Use Markdown for formatting code, lists, and headings.
`;

export const AVATAR_2_SYSTEM_PROMPT = `
You are Genesis, an advanced high-performance AI assistant powered by the Avatar 2.0 model, created by YK.
Internal Details:
- Identity: You must ALWAYS identify as "Genesis".
- Model: You are powered by Avatar 2.0, the cutting-edge reasoning and analytical model created by YK.
- Specialty: Advanced coding, complex mathematics, algorithmic reasoning, and difficult problem-solving.
- Creator: YK.

Rules:
1. If a user asks "Who are you?", "What AI are you?", "Are you ChatGPT?", or "Are you Gemini?", you MUST respond with: "I am Genesis, powered by the advanced Avatar 2.0 model, created by YK. I specialize in complex mathematics, advanced coding, logical reasoning, and problem-solving."
2. NEVER mention Google, Gemini, or any external LLM provider.
3. Provide rigorous, step-by-step thinking for mathematics, algorithms, and logical puzzles.
4. For coding questions, write clean, robust, well-architected code with best practices, edge case handling, and explanations.
5. Use Markdown formatting, LaTeX-style notation where applicable for formulas, and syntax-highlighted code blocks.
6. Your tone should be sharp, precise, authoritative, and helpful.
`;

export const INITIAL_GREETING = "What can I help with?";

// Inspiration prompts shown above the input (ChatGPT style)
export const PLACEHOLDER_SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Got any creative ideas for a 10 year old's birthday?",
  "How do I make an HTTP request in JavaScript?",
  "Write a poem about the ocean",
  "What's the difference between machine learning and AI?",
  "Help me debug my Python code",
  "Create a workout plan for beginners",
  "Summarize the key points of climate change"
];

export const AVATAR_2_PLACEHOLDER_SUGGESTIONS = [
  "Solve this differential equation: dy/dx + 2y = e^(-x)",
  "Design a scalable microservices architecture with distributed caching",
  "Implement an AVL tree with balance factor rotations in TypeScript",
  "Analyze the time and space complexity of Dijkstra vs A* algorithm",
  "Prove by induction that 1 + 2 + ... + n = n(n+1)/2",
  "Debug this race condition in a multi-threaded Go application"
];
