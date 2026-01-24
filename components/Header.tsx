
import React from 'react';
import { AVATAR_IDENTITY } from '../constants.ts';

interface HeaderProps {
  isLoading?: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoading, isDarkMode, onToggleTheme }) => {
  const headerBg = isDarkMode ? 'bg-[#0f0f0f]/95' : 'bg-white/95';
  const borderColor = isDarkMode ? 'border-white/[0.05]' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${headerBg} backdrop-blur-xl py-3 px-4 md:px-6 flex items-center justify-between border-b ${borderColor} transition-all duration-500 shadow-lg`}>
      <div className="flex items-center w-[100px] md:w-[140px]">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-yellow-300'
              : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
            }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            // Sun icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            // Moon icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <div className="relative">
          <h1 className={`text-lg md:text-xl font-bold ${textColor} tracking-tight transition-all duration-500 ${isLoading ? 'opacity-80' : 'opacity-100'
            } bg-gradient-to-r ${isDarkMode
              ? 'from-white via-purple-200 to-pink-200'
              : 'from-gray-900 via-purple-700 to-pink-600'
            } bg-clip-text text-transparent`}>
            Avatar
          </h1>
          {isLoading && (
            <span className={`absolute -right-3 top-1 w-1.5 h-1.5 rounded-full animate-pulse shadow-lg ${isDarkMode ? 'bg-purple-400' : 'bg-blue-500'
              }`} style={{ boxShadow: isDarkMode ? '0 0 10px rgba(192, 132, 252, 0.7)' : '0 0 10px rgba(59, 130, 246, 0.7)' }} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-[100px] md:w-[140px] justify-end">
        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[11px] md:text-[12px] font-bold transition-all cursor-default transform hover:scale-110 ${isDarkMode
            ? 'border border-white/20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white/80 hover:border-white/40'
            : 'border border-gray-300 bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700 hover:border-gray-400'
          }`}>
          {AVATAR_IDENTITY.creator}
        </div>
      </div>

      {isLoading && (
        <div className={`absolute bottom-0 left-0 h-[2px] w-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'
          }`}>
          <div className={`h-full animate-[shimmer_2s_infinite] ${isDarkMode
              ? 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
              : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'
            }`} style={{ width: '40%' }} />
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </header>
  );
};

export default Header;
