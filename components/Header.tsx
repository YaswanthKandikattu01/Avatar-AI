import React, { useState, useEffect, useRef } from 'react';
import { AvatarModelId } from '../types.ts';
import { AVAILABLE_MODELS } from '../constants.ts';

interface HeaderProps {
  isLoading: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onBackToHome: () => void;
  onClearConversation: () => void;
  showMobileLogo?: boolean;
  onToggleMobileLogo?: () => void;
  hasStarted?: boolean;
  selectedModel: AvatarModelId;
  onSelectModel: (model: AvatarModelId) => void;
}

const Header: React.FC<HeaderProps> = ({
  isLoading,
  isDarkMode,
  onToggleTheme,
  onBackToHome,
  onClearConversation,
  showMobileLogo = true,
  onToggleMobileLogo,
  hasStarted = false,
  selectedModel,
  onSelectModel,
}) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerBg = isDarkMode
    ? hasScrolled
      ? 'bg-black/80 backdrop-blur-md border-b border-white/5'
      : 'bg-transparent'
    : hasScrolled
    ? 'bg-white/80 backdrop-blur-md border-b border-gray-200'
    : 'bg-transparent';

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const iconHover = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100';

  const currentModelInfo =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg} h-[60px] md:h-[70px]`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative">
        {/* LEFT SIDE: Back & Theme */}
        <div className="flex items-center gap-2 md:gap-3">
          {hasStarted && (
            <button
              onClick={onBackToHome}
              className={`p-2 rounded-full transition-all duration-300 ${iconHover} group`}
              title="Back to Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-5 h-5 md:w-6 md:h-6 ${textColor} opacity-70 group-hover:opacity-100 transition-opacity`}
              >
                <path
                  fillRule="evenodd"
                  d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${iconHover} group`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 opacity-90 group-hover:opacity-100 group-hover:rotate-12 transition-all"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 md:w-6 md:h-6 text-blue-600 opacity-90 group-hover:opacity-100 group-hover:-rotate-12 transition-all"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* CENTER: Genesis Text (Clickable) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer pointer-events-auto group"
          onClick={onBackToHome}
          title="Go to Home"
        >
          <span
            className={`text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r ${
              isDarkMode ? 'from-cyan-400 to-blue-500' : 'from-cyan-600 to-blue-700'
            } bg-clip-text text-transparent group-hover:scale-105 transition-transform`}
          >
            Genesis
          </span>
          {isLoading && (
            <span className="absolute -right-3 top-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          )}
        </div>

        {/* RIGHT SIDE: Model Selector & Actions */}
        <div className="flex items-center justify-end gap-2 md:gap-3">
          {/* Selectable Model Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-full transition-all duration-300 border shadow-sm ${
                selectedModel === 'avatar-2.0'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 shadow-cyan-900/20'
                    : 'bg-gradient-to-r from-cyan-50 to-indigo-50 border-cyan-300 text-cyan-800 hover:border-cyan-400'
                  : isDarkMode
                  ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
              }`}
              title="Select AI Model"
              aria-expanded={isModelDropdownOpen}
            >
              <div
                className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center ${
                  selectedModel === 'avatar-2.0'
                    ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 shadow-sm'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/90"></div>
              </div>

              <span className="text-xs font-semibold tracking-wide flex items-center gap-1">
                {currentModelInfo.name}
                {selectedModel === 'avatar-2.0' && (
                  <span className="hidden sm:inline-block text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                    2.0
                  </span>
                )}
              </span>

              <svg
                className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                  isModelDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isModelDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-72 md:w-80 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl border transition-all duration-200 z-50 animate-in fade-in zoom-in-95 ${
                  isDarkMode
                    ? 'bg-[#141414]/95 border-white/10 text-white shadow-black/80'
                    : 'bg-white/95 border-gray-200 text-gray-900 shadow-xl'
                }`}
              >
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-500">
                    Select AI Model
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    Choose the best model for your task
                  </p>
                </div>

                <div className="space-y-1">
                  {AVAILABLE_MODELS.map((model) => {
                    const isSelected = selectedModel === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => {
                          onSelectModel(model.id);
                          setIsModelDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex flex-col gap-1 ${
                          isSelected
                            ? isDarkMode
                              ? 'bg-white/10 border border-cyan-500/30'
                              : 'bg-blue-50/80 border border-blue-200'
                            : isDarkMode
                            ? 'hover:bg-white/5 border border-transparent'
                            : 'hover:bg-gray-100/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold flex items-center gap-1.5">
                              {model.name}
                              {model.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-extrabold shadow-sm">
                                  {model.badge}
                                </span>
                              )}
                            </span>
                          </div>
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-cyan-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>

                        <p
                          className={`text-xs leading-relaxed ${
                            isDarkMode ? 'text-white/70' : 'text-gray-600'
                          }`}
                        >
                          {model.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-1">
                          {model.capabilities.slice(0, 2).map((cap, i) => (
                            <span
                              key={i}
                              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                                isDarkMode
                                  ? 'bg-white/5 text-white/60'
                                  : 'bg-gray-200/60 text-gray-700'
                              }`}
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Visual Toggle - Only visible when needed */}
          {onToggleMobileLogo && (
            <button
              onClick={onToggleMobileLogo}
              className={`md:hidden p-2 rounded-full transition-all duration-300 ${iconHover} group ${
                showMobileLogo ? 'bg-white/5' : ''
              }`}
              title={showMobileLogo ? 'Hide Visual' : 'Show Visual'}
            >
              {showMobileLogo ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 ${textColor} opacity-70 group-hover:opacity-100`}
                >
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path
                    fillRule="evenodd"
                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 ${textColor} opacity-70 group-hover:opacity-100`}
                >
                  <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.611 3.29l-6.528-6.528a4.5 4.5 0 00-5.858 5.858l-2.202-2.202a11.249 11.249 0 012.611-3.29c1.49-4.47 5.708-7.696 10.677-7.696 2.555 0 4.945.846 6.9 2.274l-2.079 2.079c-.933-.42-1.954-.663-3.04-.663a7.489 7.489 0 00-5.292 2.19l-1.06 1.06a7.514 7.514 0 003.111 11.085l-1.636-1.636a4.5 4.5 0 014.184-4.184l-1.636-1.636a7.489 7.489 0 002.19-5.292c0-1.086-.242-2.107-.663-3.04l2.08-2.08a11.238 11.238 0 012.274 6.9 1.762 1.762 0 01-.114.613z" />
                </svg>
              )}
            </button>
          )}

          {hasStarted && (
            <button
              onClick={onClearConversation}
              className={`p-2 rounded-full transition-all duration-300 ${iconHover} group`}
              title="Clear Conversation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 md:w-6 md:h-6 text-red-500 opacity-80 group-hover:opacity-100 transition-opacity"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
