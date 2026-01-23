<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Avatar Lite - AI Chatbot

**Avatar Lite** is a high-performance AI assistant created by YK, powered by Google's Gemini AI. It features a robust API key fallback mechanism to ensure uninterrupted service.

## 🚀 Features

- **Real-time AI Conversation**: Chat with Avatar Lite using Google's Gemini AI
- **API Key Fallback**: Automatic switching between multiple API keys if one fails
- **Conversation History**: Remembers the last 10 messages for context-aware responses
- **Live Information**: Provides current date/time and up-to-date information
- **Streaming Responses**: Real-time text streaming for faster interaction

## 📋 Prerequisites

- **Node.js** (version 18.0.0 or higher)
- **Gemini API Keys** (Get them from [Google AI Studio](https://aistudio.google.com/app/apikey))

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YaswanthKandikattu01/Avatar-AI.git
cd Avatar-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Keys

Create a `.env` file in the root directory:

```env
API_KEY_1=your_first_gemini_api_key_here
API_KEY_2=your_second_gemini_api_key_here
API_KEY_3=your_third_gemini_api_key_here
```

**Note:** The application supports multiple API keys for fallback. If one key fails (e.g., rate limit exceeded), it automatically switches to the next available key. You can add 1-3 keys.

### 4. Run the Application

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your environment).

## 🔧 API Key Fallback Logic

The application implements an intelligent API key rotation system:

1. **Random Selection**: Starts with a randomly selected API key
2. **Automatic Retry**: If a key fails, automatically tries the next available key
3. **Sequential Fallback**: Cycles through all available keys before giving up
4. **Logging**: Logs which key is being used (masked for security)

## 🌐 Deployment

### Deploy to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Create a new Web Service
4. Connect your GitHub repository
5. Add environment variables:
   - `API_KEY_1`: Your first Gemini API key
   - `API_KEY_2`: Your second Gemini API key
6. Deploy!

## 📁 Project Structure

```
Avatar-AI/
├── server.js          # Express server with API key fallback
├── App.tsx            # React main component
├── index.html         # HTML entry point
├── package.json       # Dependencies
├── .env              # Environment variables (not committed)
└── components/       # React components
```

## 🔐 Security Notes

- **Never commit `.env` file** to version control
- API keys are masked in server logs
- The `.env` file is included in `.gitignore`
- For production, use environment variables on your hosting platform

## 📝 License

Created by YK

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Enjoy chatting with Avatar Lite! 🤖**
