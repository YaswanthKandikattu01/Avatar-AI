
import React from 'react';
import { AVATAR_IDENTITY } from '../constants.ts';

interface HeaderProps {
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoading }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#212121]/80 backdrop-blur-xl py-3 px-4 md:px-6 flex items-center justify-between border-b border-white/[0.03] transition-all duration-300">
      <div className="flex items-center w-[100px] md:w-[140px]" />
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <div className="relative">
          <h1 className={`text-lg md:text-xl font-bold text-white tracking-tight transition-opacity duration-500 ${isLoading ? 'opacity-80' : 'opacity-100'}`}>
            Avatar
          </h1>
          {isLoading && (
            <span className="absolute -right-3 top-1 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 w-[100px] md:w-[140px] justify-end">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[10px] md:text-[11px] font-bold text-white/70 hover:border-white/20 transition-all cursor-default">
          {AVATAR_IDENTITY.creator}
        </div>
      </div>
      {isLoading && (
        <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-[shimmer_2s_infinite]" />
      )}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </header>
  );
};

export default Header;
