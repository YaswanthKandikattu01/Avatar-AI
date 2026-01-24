
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.tsx';
import MessageBubble from './components/MessageBubble.tsx';
import ChatInput from './components/ChatInput.tsx';
import { Message, Role } from './types.ts';
import { INITIAL_GREETING, PLACEHOLDER_SUGGESTIONS } from './constants.ts';
import { avatarService } from './services/avatarService.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(PLACEHOLDER_SUGGESTIONS[0]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Rotate placeholder text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder(
        PLACEHOLDER_SUGGESTIONS[Math.floor(Math.random() * PLACEHOLDER_SUGGESTIONS.length)]
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!hasStarted) setHasStarted(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const avatarMsgId = (Date.now() + 1).toString();
    const avatarMessage: Message = {
      id: avatarMsgId,
      role: Role.AVATAR,
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, avatarMessage]);

    try {
      // Prepare conversation history (last 5 exchanges = 10 messages)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'assistant',
        content: msg.content
      }));

      let fullContent = '';
      for await (const chunk of avatarService.processQueryStream(content, conversationHistory)) {
        fullContent += chunk;
        setMessages(prev => prev.map(msg =>
          msg.id === avatarMsgId ? { ...msg, content: fullContent } : msg
        ));
      }
    } catch (error) {
      console.error("Avatar communication error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const bgColor = isDarkMode ? 'bg-[#0f0f0f]' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`flex flex-col h-[100dvh] ${bgColor} ${textColor} selection:${isDarkMode ? 'bg-white/10' : 'bg-blue-200/50'} overflow-hidden transition-colors duration-500`}>
      <Header isLoading={isLoading} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pt-16 md:pt-20 px-4 md:px-0 custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto min-h-full flex flex-col">
          {!hasStarted && messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 pb-20">
              {/* Stunning Avatar Logo with gradient */}
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl ${isDarkMode
                  ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500'
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                } flex items-center justify-center mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="text-3xl md:text-4xl text-white font-bold tracking-tighter relative z-10">A</span>

                {/* Animated glow effect */}
                <div className={`absolute inset-0 rounded-3xl blur-xl opacity-50 ${isDarkMode
                    ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500'
                    : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                  } animate-pulse`}></div>
              </div>

              <h2 className={`text-3xl md:text-5xl font-bold mb-3 text-center px-4 tracking-tight leading-tight bg-gradient-to-r ${isDarkMode
                  ? 'from-white via-purple-200 to-pink-200'
                  : 'from-gray-900 via-purple-700 to-pink-600'
                } bg-clip-text text-transparent`}>
                {INITIAL_GREETING}
              </h2>

              <p className={`text-lg md:text-xl font-light text-center px-4 mb-8 ${isDarkMode ? 'text-white/40' : 'text-gray-500'
                }`}>
                Powered by Avatar AI
              </p>

              {/* Animated suggestion cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl px-4 mt-8">
                {PLACEHOLDER_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                        : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
                      }`}
                  >
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-white/70' : 'text-gray-700'}`}>
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full pt-4 md:pt-8 flex-1">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isDarkMode={isDarkMode} />
              ))}
              <div ref={messagesEndRef} className="h-12 md:h-20" />
            </div>
          )}
        </div>
      </main>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        placeholder={currentPlaceholder}
      />
    </div>
  );
};

export default App;
