
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Role } from '../types.ts';

interface MessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isDarkMode }) => {
  const isAvatar = message.role === Role.AVATAR;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (message.content) {
      try {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const avatarBg = isDarkMode
    ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20'
    : 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20';

  const avatarBorder = isDarkMode ? 'border-purple-500/30' : 'border-blue-500/30';
  const avatarText = isDarkMode ? 'text-gray-200' : 'text-gray-800';

  const userBg = isDarkMode
    ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600'
    : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500';

  const userText = 'text-white';
  const copyButtonBg = isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-100 hover:bg-gray-200 border-gray-300';

  return (
    <div className={`flex w-full mb-6 md:mb-10 ${isAvatar ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-1 duration-500`}>
      <div className={`max-w-[90%] md:max-w-[85%] ${isAvatar ? 'flex flex-row gap-3 md:gap-4' : ''}`}>
        {isAvatar && (
          <div className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full ${avatarBg} flex items-center justify-center text-xs md:text-sm font-bold ${userText} shadow-lg border ${avatarBorder} mt-1 transform hover:scale-110 transition-transform duration-300`}>
            A
          </div>
        )}
        <div className={`relative group ${isAvatar ? 'flex-1' : ''}`}>
          <div className={`p-4 md:p-5 rounded-2xl transition-all duration-300 ${isAvatar
            ? `${isDarkMode ? 'bg-transparent' : 'bg-white/50 border border-gray-200/50'} ${avatarText} leading-relaxed pr-12`
            : `${userBg} ${userText} shadow-lg px-5 hover:shadow-xl`
            }`}>
            <div className={`prose ${isDarkMode ? 'prose-invert' : 'prose-gray'} max-w-none text-[15px] md:text-base selection:${isDarkMode ? 'bg-white/20' : 'bg-blue-200/50'}`}>
              {isAvatar ? (
                <div className="relative">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({ node, inline, className, children, ...props }) => {
                        return inline ? (
                          <code className={`${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} px-1.5 py-0.5 rounded text-sm`} {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className={`block ${isDarkMode ? 'bg-black/30' : 'bg-gray-100'} p-3 rounded-lg overflow-x-auto`} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  {!message.content && <span className={`inline-block w-2 h-4 ${isDarkMode ? 'bg-white/40' : 'bg-gray-400'} animate-pulse ml-1 align-middle rounded-sm`} />}
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              )}
            </div>
          </div>

          {/* Copy Button - Only for Avatar messages with content */}
          {isAvatar && message.content && (
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-lg ${copyButtonBg} border backdrop-blur-sm transform hover:scale-110`}
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
