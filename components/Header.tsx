
import React from 'react';

interface HeaderProps {
  isLoading?: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onBackToHome: () => void;
  onClearConversation: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoading, isDarkMode, onToggleTheme, onBackToHome, onClearConversation }) => {
  const headerBg = isDarkMode ? 'bg-[#0f0f0f]/95' : 'bg-white/95';
  const borderColor = isDarkMode ? 'border-white/[0.05]' : 'border-gray-200';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${headerBg} backdrop-blur-xl py-3 px-4 md:px-6 flex items-center justify-between border-b ${borderColor} transition-all duration-500 shadow-lg`}>

      {/* LEFT SIDE: Theme & Home */}
      <div className="flex items-center gap-3 w-[140px] md:w-[160px]">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${isDarkMode
            ? 'bg-white/10 hover:bg-white/20 text-yellow-300'
            : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
            }`}
          aria-label="Toggle theme"
          title="Toggle Theme"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${isDarkMode
            ? 'bg-white/10 hover:bg-white/20 text-white/90'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          aria-label="Back to Home"
          title="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.632 8.632a.75.75 0 001.06-1.06L12 1.12 1.777 11.412a.75.75 0 001.06 1.06L11.47 3.84z" />
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" opacity="0" />
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" opacity="0" />
            {/* House Icon */}
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.632 8.632a.75.75 0 001.06-1.06L12 1.12 1.777 11.412a.75.75 0 001.06 1.06L11.47 3.84z" />
            <path d="M4.5 10.5v7.5a3 3 0 003 3h9a3 3 0 003-3v-7.5a.75.75 0 011.5 0v7.5a4.5 4.5 0 01-4.5 4.5h-9a4.5 4.5 0 01-4.5-4.5v-7.5a.75.75 0 011.5 0z" />
          </svg>
        </button>
      </div>

      {/* CENTER: Genesis Text (Clickable) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer pointer-events-auto group"
        onClick={onBackToHome}
        title="Go to Home"
      >
        <div className="relative">
          <h1 className={`text-lg md:text-xl font-bold tracking-tight transition-all duration-500 ${isLoading ? 'opacity-80' : 'opacity-100'
            } bg-gradient-to-r ${isDarkMode
              ? 'from-cyan-300 via-blue-400 to-indigo-400 group-hover:from-cyan-200 group-hover:via-blue-300 group-hover:to-indigo-300'
              : 'from-cyan-600 via-blue-600 to-indigo-600 group-hover:from-cyan-500 group-hover:via-blue-500 group-hover:to-indigo-500'
            } bg-clip-text text-transparent`}>
            Genesis
          </h1>
          {isLoading && (
            <span className={`absolute -right-3 top-1 w-1.5 h-1.5 rounded-full animate-pulse shadow-lg ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
              }`}></span>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Clear Conversation */}
      <div className="flex items-center justify-end w-[140px] md:w-[160px]">
        <button
          onClick={onClearConversation}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 ${isDarkMode
            ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-red-400'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-red-500'
            }`}
          title="Clear Conversation"
        >
          <span className="text-xs font-medium hidden md:block">Clear</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.49 1.478l-.565.058a48.772 48.772 0 01-7.823 0l-.565-.058a.75.75 0 01-.49-1.478 2.013 2.013 0 01-3.41-2.388 48.72 48.72 0 01-1.032 0 2.013 2.013 0 00-.638 1.846c2.48.27 4.975.27 7.455 0a2.013 2.013 0 00-.638-1.846z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M8.155 10.458a.75.75 0 10-1.493.146l1.22 8.544a2.25 2.25 0 002.23 1.93h5.776a2.25 2.25 0 002.23-1.93l1.22-8.544a.75.75 0 00-1.493-.146l-1.22 8.544a.75.75 0 01-.743.644H10.12a.75.75 0 01-.743-.644l-1.22-8.544z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

    </header>
  );
};

export default Header;
