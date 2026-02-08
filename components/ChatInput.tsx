
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
  placeholder: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, isDarkMode, placeholder }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (content.trim() && !isLoading) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const inputBg = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-white/[0.08]' : 'border-gray-200';
  const inputFocusBg = isDarkMode ? 'focus-within:bg-[#222]' : 'focus-within:bg-gray-50';
  const inputText = isDarkMode ? 'text-white' : 'text-gray-900';
  const placeholderColor = isDarkMode ? 'placeholder:text-white/30' : 'placeholder:text-gray-400';
  const footerBg = isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50';

  return (
    <div className={`w-full ${footerBg} z-40 px-4 md:px-0 transition-colors duration-500`}>
      <div className="max-w-3xl mx-auto pt-1 pb-3 md:pb-5 flex flex-col items-center">

        <form
          onSubmit={handleSubmit}
          className={`w-full flex items-end ${inputBg} border ${inputBorder} rounded-[24px] md:rounded-[28px] overflow-hidden shadow-xl hover:shadow-2xl ${inputFocusBg} transition-all duration-300 ${isDarkMode
            ? 'focus-within:ring-2 focus-within:ring-blue-500/30'
            : 'focus-within:ring-2 focus-within:ring-cyan-400/30'
            }`}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className={`flex-1 bg-transparent border-none outline-none ${inputText} p-3 md:p-4 pl-5 resize-none text-[14px] md:text-[15px] ${placeholderColor} custom-scrollbar leading-relaxed min-h-[44px] max-h-[150px] transition-all`}
            disabled={isLoading}
          />

          <div className="p-2 md:p-3 flex-shrink-0">
            <button
              type="submit"
              disabled={!content.trim() || isLoading}
              className={`p-3 rounded-full transition-all duration-300 transform ${content.trim() && !isLoading
                ? isDarkMode
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white hover:shadow-lg hover:scale-110 scale-100'
                  : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-110 scale-100'
                : isDarkMode
                  ? 'bg-white/5 text-white/10 scale-90 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-300 scale-90 cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </div>
        </form>

        <div className="mt-3">
          <p className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${isDarkMode ? 'text-white/20' : 'text-gray-400'
            }`}>
            Designed by YK ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
