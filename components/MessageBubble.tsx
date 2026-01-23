
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Role } from '../types.ts';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
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

  return (
    <div className={`flex w-full mb-6 md:mb-10 ${isAvatar ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-1 duration-500`}>
      <div className={`max-w-[90%] md:max-w-[85%] ${isAvatar ? 'flex flex-row gap-3 md:gap-4' : ''}`}>
        {isAvatar && (
          <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center text-[10px] md:text-xs font-bold text-white shadow-lg border border-white/10 mt-1">
            A
          </div>
        )}
        <div className={`relative group ${isAvatar ? 'flex-1' : ''}`}>
          <div className={`p-4 rounded-2xl ${isAvatar
              ? 'bg-transparent text-gray-200 leading-relaxed pr-12'
              : 'bg-[#2f2f2f] border border-white/5 text-white shadow-md px-5'
            }`}>
            <div className="prose prose-invert max-w-none text-[15px] md:text-base selection:bg-white/20">
              {isAvatar ? (
                <div className="relative">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                  {!message.content && <span className="inline-block w-2 h-4 bg-white/40 animate-pulse ml-1 align-middle" />}
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
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
