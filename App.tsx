
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
  const [isDarkMode, setIsDarkMode] = useState(true);

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
      console.error("Genesis communication error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBackToHome = () => {
    setHasStarted(false);
  };

  const handleClearConversation = () => {
    setMessages([]);
    setHasStarted(false);
  };

  const bgColor = isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  // Dynamic Logo Colors
  const cPri = isDarkMode ? "#22d3ee" : "#0284c7"; // Cyan
  const cSec = isDarkMode ? "#60a5fa" : "#2563eb"; // Blue
  const cAcc = isDarkMode ? "#6366f1" : "#4f46e5"; // Indigo
  const cAccL = isDarkMode ? "#818cf8" : "#6366f1"; // Indigo Light
  const cLoadP = isDarkMode ? "#fb923c" : "#ea580c"; // Orange
  const cLoadS = isDarkMode ? "#f97316" : "#c2410c"; // Dark Orange
  const cLoadL = isDarkMode ? "#fdba74" : "#fb923c"; // Light Orange
  const cLoadA = isDarkMode ? "#f59e0b" : "#d97706"; // Amber

  return (
    <div className={`flex flex-col h-[100dvh] ${bgColor} ${textColor} selection:${isDarkMode ? 'bg-white/10' : 'bg-blue-200/50'} overflow-hidden transition-colors duration-500`}>
      <Header
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onBackToHome={handleBackToHome}
        onClearConversation={handleClearConversation}
      />

      {/* Main Content Area - Transitions from Centered to Split Screen */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SIDE: JARVIS Logo Area - Refactored for Flex Responsiveness */}
        <div className={`relative transition-all duration-1000 ease-in-out flex flex-col items-center
          ${!hasStarted
            ? 'w-full h-full justify-between py-12 md:py-16'
            : 'w-full h-[30vh] md:w-[45%] md:h-full justify-center border-b md:border-b-0 md:border-r border-white/5 bg-black/20'
          }
        `}>

          {/* Welcome Text Section - Flex Item */}
          <div className={`w-full text-center transition-all duration-700 px-4 ${!hasStarted
              ? 'opacity-100 translate-y-0 h-auto'
              : 'opacity-0 -translate-y-10 h-0 overflow-hidden pointer-events-none'
            } z-20`}>
            <h2 className={`text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight bg-gradient-to-r ${isDarkMode
              ? 'from-cyan-300 via-blue-400 to-indigo-400'
              : 'from-cyan-600 via-blue-600 to-indigo-600'
              } bg-clip-text text-transparent`}>
              {INITIAL_GREETING}
            </h2>

            {/* Model Tag */}
            <div className="flex justify-center">
              <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 ${isDarkMode
                ? 'bg-white/5 border border-white/10'
                : 'bg-gray-100 border border-gray-200'
                }`}>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/90"></div>
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
                  Avatar
                </span>
              </div>
            </div>
          </div>

          {/* JARVIS LOGO CONTAINER - Flex Grow Item */}
          {/* This element grows to take available space, centering partially by flex mechanics */}
          <div className={`transition-all duration-1000 ease-in-out z-10 flex-1 flex items-center justify-center w-full my-4 ${!hasStarted ? 'scale-75 md:scale-100' : 'scale-[0.6] md:scale-90'
            }`}>
            {/* JARVIS Armillary Sphere Component */}
            <div className="jarvis-container relative" style={{ perspective: '1000px' }}>
              <div className="w-52 h-52 md:w-64 md:h-64 relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

                {/* Outer ambient glow */}
                <div className={`absolute inset-[-30%] rounded-full blur-3xl jarvis-ambient-glow transition-all duration-1000 ${isLoading
                    ? 'bg-gradient-radial from-orange-500/20 via-amber-400/5 to-transparent'
                    : (isDarkMode ? 'bg-gradient-radial from-blue-500/20 via-cyan-400/5 to-transparent' : 'bg-gradient-radial from-blue-600/30 via-cyan-500/10 to-transparent')
                  }`}></div>

                {/* RING 2 */}
                <div className="absolute inset-[5%] orbital-ring-2" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="95" fill="none" stroke={isLoading ? cLoadP : cPri} strokeWidth="2" strokeDasharray="15 8 5 8" opacity="0.7" className="transition-all duration-700" />
                    <circle cx="100" cy="100" r="95" fill="none" stroke={isLoading ? cLoadL : cSec} strokeWidth="1" opacity="0.3" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* RING 3 */}
                <div className="absolute inset-[10%] orbital-ring-3" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="92" fill="none" stroke={isLoading ? cLoadS : cAcc} strokeWidth="2.5" strokeDasharray="25 15" opacity="0.6" className="transition-all duration-700" />
                    <circle cx="100" cy="100" r="92" fill="none" stroke={isLoading ? cLoadP : cAccL} strokeWidth="1" opacity="0.3" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 4 */}
                <div className="absolute inset-[15%] orbital-ring-4" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="88" fill="none" stroke={isLoading ? cLoadP : cPri} strokeWidth="2" strokeDasharray="10 20 5 20" opacity="0.5" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 5 */}
                <div className="absolute inset-[20%] orbital-ring-5" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="85" fill="none" stroke={isLoading ? cLoadA : cSec} strokeWidth="1.5" strokeDasharray="3 6" opacity="0.6" className="transition-all duration-700" />
                    <polygon points="100,18 105,28 95,28" fill={isLoading ? cLoadL : cSec} opacity="0.8" className="transition-all duration-700" />
                    <polygon points="182,100 172,105 172,95" fill={isLoading ? cLoadL : cSec} opacity="0.8" className="transition-all duration-700" />
                    <polygon points="100,182 95,172 105,172" fill={isLoading ? cLoadL : cSec} opacity="0.8" className="transition-all duration-700" />
                    <polygon points="18,100 28,95 28,105" fill={isLoading ? cLoadL : cSec} opacity="0.8" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 6 */}
                <div className="absolute inset-[28%] orbital-ring-6" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke={isLoading ? cLoadS : cAcc} strokeWidth="2" strokeDasharray="12 8" opacity="0.5" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 7 */}
                <div className="absolute inset-[35%] orbital-ring-7" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="75" fill="none" stroke={isLoading ? cLoadP : cPri} strokeWidth="1.5" strokeDasharray="5 10" opacity="0.6" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 8 */}
                <div className="absolute inset-[8%] orbital-ring-8" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke={isLoading ? cLoadS : cAcc} strokeWidth="1.5" strokeDasharray="18 12" opacity="0.5" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 9 */}
                <div className="absolute inset-[12%] orbital-ring-9" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="87" fill="none" stroke={isLoading ? cLoadP : cPri} strokeWidth="1.8" strokeDasharray="7 14" opacity="0.6" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 10 */}
                <div className="absolute inset-[25%] orbital-ring-10" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="82" fill="none" stroke={isLoading ? cLoadA : cSec} strokeWidth="1.5" strokeDasharray="4 8" opacity="0.5" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 11 */}
                <div className="absolute inset-[18%] orbital-ring-11" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="86" fill="none" stroke={isLoading ? cLoadL : cSec} strokeWidth="2" strokeDasharray="20 10" opacity="0.6" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 12 */}
                <div className="absolute inset-[32%] orbital-ring-12" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="77" fill="none" stroke={isLoading ? cLoadP : cAccL} strokeWidth="1.5" strokeDasharray="6 12" opacity="0.5" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 13 */}
                <div className="absolute inset-[40%] orbital-ring-13" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="70" fill="none" stroke={isLoading ? cLoadS : cPri} strokeWidth="2" strokeDasharray="3 9" opacity="0.7" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 14 */}
                <div className="absolute inset-[6%] orbital-ring-14" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="93" fill="none" stroke={isLoading ? cLoadL : cSec} strokeWidth="1.5" strokeDasharray="2 8" opacity="0.6" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 15 */}
                <div className="absolute inset-[22%] orbital-ring-15" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="84" fill="none" stroke={isLoading ? cLoadA : cSec} strokeWidth="2" strokeDasharray="16 6 4 6" opacity="0.5" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 16 */}
                <div className="absolute inset-[14%] orbital-ring-16" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="88" fill="none" stroke={isLoading ? cLoadP : cAccL} strokeWidth="1.8" strokeDasharray="10 5 3 5" opacity="0.6" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 17 */}
                <div className="absolute inset-[30%] orbital-ring-17" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="78" fill="none" stroke={isLoading ? cLoadS : cPri} strokeWidth="1.5" strokeDasharray="6 6" opacity="0.7" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 18 */}
                <div className="absolute inset-[38%] orbital-ring-18" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="72" fill="none" stroke={isLoading ? cLoadA : cAcc} strokeWidth="2" strokeDasharray="4 12" opacity="0.6" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* Ring 19 */}
                <div className="absolute inset-[16%] orbital-ring-19" style={{ transformStyle: 'preserve-3d' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="87" fill="none" stroke={isLoading ? cLoadL : cSec} strokeWidth="1.5" strokeDasharray="30 8" opacity="0.5" className="transition-all duration-700" />
                  </svg>
                </div>

                {/* STATIC CORE */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className={`absolute w-24 h-24 md:w-28 md:h-28 rounded-full blur-xl jarvis-core-outer-glow transition-all duration-700 ${isLoading ? 'bg-orange-500/20' : (isDarkMode ? 'bg-blue-500/20' : 'bg-blue-600/30')
                    }`}></div>
                  <div className={`absolute w-20 h-20 md:w-24 md:h-24 rounded-full blur-lg jarvis-core-mid-glow transition-all duration-700 ${isLoading ? 'bg-amber-400/30' : (isDarkMode ? 'bg-cyan-400/30' : 'bg-cyan-500/30')
                    }`}></div>

                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl jarvis-core relative transition-all duration-700 ${isLoading
                      ? 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600'
                      : (isDarkMode ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600' : 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700')
                    }`}>
                    <div className={`absolute inset-2 rounded-full border-2 transition-all duration-700 ${isLoading ? 'border-orange-300/40' : (isDarkMode ? 'border-cyan-300/40' : 'border-cyan-200/50')
                      }`}></div>
                    <div className={`absolute inset-4 rounded-full border transition-all duration-700 ${isLoading ? 'border-amber-300/30' : (isDarkMode ? 'border-blue-300/30' : 'border-blue-200/40')
                      }`}></div>

                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-700 ${isLoading
                        ? 'bg-gradient-to-br from-orange-300 via-amber-400 to-yellow-500'
                        : (isDarkMode ? 'bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-500' : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600')
                      }`}>
                      <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full shadow-inner jarvis-inner-core transition-all duration-700 ${isLoading
                          ? 'bg-gradient-to-br from-white via-orange-100 to-amber-200'
                          : (isDarkMode ? 'bg-gradient-to-br from-white via-cyan-100 to-blue-200' : 'bg-gradient-to-br from-white via-cyan-50 to-blue-100')
                        }`}></div>
                    </div>
                  </div>
                </div>

                {/* Floating energy particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="energy-particle p1"></div>
                  <div className="energy-particle p2"></div>
                  <div className="energy-particle p3"></div>
                  <div className="energy-particle p4"></div>
                  <div className="energy-particle p5"></div>
                  <div className="energy-particle p6"></div>
                  <div className="energy-particle p7"></div>
                  <div className="energy-particle p8"></div>
                </div>

              </div>
            </div>
          </div>

          {/* Welcome INPUT position - Only visible when NOT started */}
          <div className={`w-full max-w-xl mx-auto px-6 transition-all duration-500 ${!hasStarted
              ? 'opacity-100 translate-y-0 h-auto'
              : 'opacity-0 translate-y-10 h-0 overflow-hidden pointer-events-none'
            }`}>
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
              placeholder="Ask Genesis anything..."
            />
          </div>
        </div>

        {/* RIGHT SIDE: CHAT INTERFACE - Only visible when HAS STARTED */}
        <div className={`
          relative flex flex-col bg-opacity-50
          transition-all duration-1000 ease-in-out
          ${!hasStarted
            ? 'w-full h-0 md:w-0 md:h-full opacity-0 overflow-hidden'
            : 'w-full h-[70vh] md:w-[55%] md:h-full opacity-100'
          }
        `}>

          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar" ref={scrollContainerRef}>
            <div className="max-w-2xl mx-auto min-h-full flex flex-col justify-end">
              <div className="flex-1"></div>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isDarkMode={isDarkMode} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* Chat Input Area for Active Chat */}
          <div className="p-4 md:p-6 border-t border-white/5 bg-transparent backdrop-blur-sm">
            <div className="max-w-2xl mx-auto">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isDarkMode={isDarkMode}
                placeholder="Message Genesis..."
              />
            </div>
          </div>

        </div>

      </div>

      <style>{`
        /* Orbital Ring Animations */
        @keyframes orbit2 { from { transform: rotateX(70deg) rotateY(0deg); } to { transform: rotateX(70deg) rotateY(360deg); } }
        @keyframes orbit3 { from { transform: rotateX(70deg) rotateZ(60deg) rotateY(0deg); } to { transform: rotateX(70deg) rotateZ(60deg) rotateY(-360deg); } }
        @keyframes orbit4 { from { transform: rotateX(70deg) rotateZ(120deg) rotateY(0deg); } to { transform: rotateX(70deg) rotateZ(120deg) rotateY(360deg); } }
        @keyframes orbit5 { from { transform: rotateX(85deg) rotateZ(0deg); } to { transform: rotateX(85deg) rotateZ(360deg); } }
        @keyframes orbit6 { from { transform: rotateX(-70deg) rotateY(0deg); } to { transform: rotateX(-70deg) rotateY(-360deg); } }
        @keyframes orbit7 { from { transform: rotateX(60deg) rotateZ(-30deg) rotateY(0deg); } to { transform: rotateX(60deg) rotateZ(-30deg) rotateY(360deg); } }
        @keyframes orbit8 { from { transform: rotateX(45deg) rotateZ(45deg) rotateY(0deg); } to { transform: rotateX(45deg) rotateZ(45deg) rotateY(-360deg); } }
        @keyframes orbit9 { from { transform: rotateX(80deg) rotateZ(90deg) rotateY(0deg); } to { transform: rotateX(80deg) rotateZ(90deg) rotateY(360deg); } }
        @keyframes orbit10 { from { transform: rotateX(50deg) rotateZ(150deg) rotateY(0deg); } to { transform: rotateX(50deg) rotateZ(150deg) rotateY(-360deg); } }
        @keyframes orbit11 { from { transform: rotateX(65deg) rotateZ(30deg) rotateY(0deg); } to { transform: rotateX(65deg) rotateZ(30deg) rotateY(360deg); } }
        @keyframes orbit12 { from { transform: rotateX(-60deg) rotateZ(75deg) rotateY(0deg); } to { transform: rotateX(-60deg) rotateZ(75deg) rotateY(-360deg); } }
        @keyframes orbit13 { from { transform: rotateX(55deg) rotateZ(-45deg) rotateY(0deg); } to { transform: rotateX(55deg) rotateZ(-45deg) rotateY(360deg); } }
        @keyframes orbit14 { from { transform: rotateX(40deg) rotateZ(100deg) rotateY(0deg); } to { transform: rotateX(40deg) rotateZ(100deg) rotateY(-360deg); } }
        @keyframes orbit15 { from { transform: rotateX(75deg) rotateZ(165deg) rotateY(0deg); } to { transform: rotateX(75deg) rotateZ(165deg) rotateY(360deg); } }
        @keyframes orbit16 { from { transform: rotateX(35deg) rotateZ(200deg) rotateY(0deg); } to { transform: rotateX(35deg) rotateZ(200deg) rotateY(-360deg); } }
        @keyframes orbit17 { from { transform: rotateX(68deg) rotateZ(-80deg) rotateY(0deg); } to { transform: rotateX(68deg) rotateZ(-80deg) rotateY(360deg); } }
        @keyframes orbit18 { from { transform: rotateX(52deg) rotateZ(-120deg) rotateY(0deg); } to { transform: rotateX(52deg) rotateZ(-120deg) rotateY(-360deg); } }
        @keyframes orbit19 { from { transform: rotateX(82deg) rotateZ(220deg) rotateY(0deg); } to { transform: rotateX(82deg) rotateZ(220deg) rotateY(360deg); } }
        
        .orbital-ring-2 { animation: orbit2 25s linear infinite; }
        .orbital-ring-3 { animation: orbit3 20s linear infinite; }
        .orbital-ring-4 { animation: orbit4 18s linear infinite; }
        .orbital-ring-5 { animation: orbit5 15s linear infinite; }
        .orbital-ring-6 { animation: orbit6 12s linear infinite; }
        .orbital-ring-7 { animation: orbit7 8s linear infinite; }
        .orbital-ring-8 { animation: orbit8 22s linear infinite; }
        .orbital-ring-9 { animation: orbit9 16s linear infinite; }
        .orbital-ring-10 { animation: orbit10 14s linear infinite; }
        .orbital-ring-11 { animation: orbit11 19s linear infinite; }
        .orbital-ring-12 { animation: orbit12 11s linear infinite; }
        .orbital-ring-13 { animation: orbit13 7s linear infinite; }
        .orbital-ring-14 { animation: orbit14 21s linear infinite; }
        .orbital-ring-15 { animation: orbit15 9s linear infinite; }
        .orbital-ring-16 { animation: orbit16 17s linear infinite; }
        .orbital-ring-17 { animation: orbit17 6s linear infinite; }
        .orbital-ring-18 { animation: orbit18 13s linear infinite; }
        .orbital-ring-19 { animation: orbit19 24s linear infinite; }
        
        /* Core & Particle Animations */
        @keyframes coreGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(34, 211, 238, 0.4), 0 0 90px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 50px rgba(59, 130, 246, 0.8), 0 0 100px rgba(34, 211, 238, 0.5), 0 0 150px rgba(99, 102, 241, 0.3); }
        }
        @keyframes innerCorePulse { 0%, 100% { opacity: 0.9; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes ambientGlow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } }
        
        .jarvis-core { animation: coreGlow 3s ease-in-out infinite; }
        .jarvis-inner-core { animation: innerCorePulse 2s ease-in-out infinite; }
        .jarvis-ambient-glow { animation: ambientGlow 4s ease-in-out infinite; }
        .jarvis-core-outer-glow { animation: ambientGlow 3s ease-in-out infinite; }
        .jarvis-core-mid-glow { animation: ambientGlow 2.5s ease-in-out infinite 0.5s; }
        
        @keyframes floatParticle {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.5); opacity: 0; }
        }
        
        .energy-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: radial-gradient(circle, ${isDarkMode ? '#60a5fa' : '#2563eb'} 0%, ${isDarkMode ? '#3b82f6' : '#1d4ed8'} 50%, transparent 100%);
          box-shadow: 0 0 6px ${isDarkMode ? '#3b82f6' : '#1d4ed8'}, 0 0 12px ${isDarkMode ? '#22d3ee' : '#0891b2'};
        }
        .p1 { top: 50%; left: 50%; --tx: 80px; --ty: -60px; animation: floatParticle 3s ease-out infinite; }
        .p2 { top: 50%; left: 50%; --tx: -70px; --ty: -50px; animation: floatParticle 3.5s ease-out infinite 0.5s; }
        .p3 { top: 50%; left: 50%; --tx: 60px; --ty: 70px; animation: floatParticle 4s ease-out infinite 1s; }
        .p4 { top: 50%; left: 50%; --tx: -80px; --ty: 40px; animation: floatParticle 3.2s ease-out infinite 1.5s; }
        .p5 { top: 50%; left: 50%; --tx: 40px; --ty: -80px; animation: floatParticle 3.8s ease-out infinite 2s; }
        .p6 { top: 50%; left: 50%; --tx: -50px; --ty: 80px; animation: floatParticle 3.3s ease-out infinite 2.5s; }
        .p7 { top: 50%; left: 50%; --tx: 90px; --ty: 20px; animation: floatParticle 4.2s ease-out infinite 0.8s; }
        .p8 { top: 50%; left: 50%; --tx: -40px; --ty: -70px; animation: floatParticle 3.6s ease-out infinite 1.8s; }
      `}</style>
    </div>
  );
};

export default App;
