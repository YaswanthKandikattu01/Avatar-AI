
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
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

  return (
    <div className="w-full bg-[#212121] z-40 px-4 md:px-0">
      <div className="max-w-3xl mx-auto pt-2 pb-6 md:pb-10 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full flex items-end bg-[#2f2f2f] border border-white/[0.08] rounded-[24px] md:rounded-[28px] overflow-hidden shadow-2xl focus-within:ring-1 focus-within:ring-white/10 focus-within:bg-[#353535] transition-all"
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-white p-4 md:p-5 pl-6 resize-none text-[15px] md:text-base placeholder:text-white/30 custom-scrollbar leading-relaxed min-h-[56px] max-h-[200px]"
            disabled={isLoading}
          />

          <div className="p-2 md:p-3 flex-shrink-0">
            <button
              type="submit"
              disabled={!content.trim() || isLoading}
              className={`p-2 rounded-full transition-all duration-200 ${content.trim() && !isLoading
                  ? 'bg-white text-black hover:bg-gray-200 scale-100'
                  : 'bg-white/5 text-white/10 scale-90'
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
          <p className="text-[10px] text-white/20 font-medium tracking-wide uppercase">
            Designed by YK ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
