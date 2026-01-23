
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.tsx';
import MessageBubble from './components/MessageBubble.tsx';
import ChatInput from './components/ChatInput.tsx';
import { Message, Role } from './types.ts';
import { INITIAL_GREETING } from './constants.ts';
import { avatarService } from './services/avatarService.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col h-[100dvh] bg-[#212121] selection:bg-white/10 overflow-hidden">
      <Header isLoading={isLoading} />

      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pt-16 md:pt-20 px-4 md:px-0 custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto min-h-full flex flex-col">
          {!hasStarted && messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 pb-20">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                <span className="text-2xl md:text-3xl text-white/80 font-bold tracking-tighter">A</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold text-white mb-3 text-center px-4 tracking-tight leading-tight">
                {INITIAL_GREETING}
              </h2>
              <p className="text-white/40 text-base md:text-xl font-light text-center px-4">
                Powered by Avatar Lite
              </p>
            </div>
          ) : (
            <div className="w-full pt-4 md:pt-8 flex-1">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} className="h-12 md:h-20" />
            </div>
          )}
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
