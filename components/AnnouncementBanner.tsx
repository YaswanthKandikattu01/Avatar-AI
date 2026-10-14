import React from 'react';
import { AvatarModelId } from '../types.ts';

interface AnnouncementBannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToAvatar2: () => void;
  isDarkMode: boolean;
  currentModel: AvatarModelId;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  isOpen,
  onClose,
  onSwitchToAvatar2,
  isDarkMode,
  currentModel,
}) => {
  if (!isOpen) return null;

  const isAlreadyAvatar2 = currentModel === 'avatar-2.0';

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 px-4 pointer-events-none transition-all duration-500 animate-in fade-in slide-in-from-top-4">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div
          className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 border ${
            isDarkMode
              ? 'bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-indigo-950/80 border-cyan-500/30 text-white shadow-cyan-950/50'
              : 'bg-gradient-to-r from-blue-50/95 via-indigo-50/95 to-cyan-50/95 border-blue-300/80 text-gray-900 shadow-blue-500/10'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            {/* Announcement Message */}
            <div className="flex items-start gap-3 flex-1 pr-6 sm:pr-0">
              <span className="text-2xl flex-shrink-0 animate-bounce" role="img" aria-label="Rocket">
                🚀
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    New Release
                  </span>
                  <span className="text-xs font-semibold text-blue-400">
                    Model Upgrade
                  </span>
                </div>
                <p className={`text-sm md:text-[15px] font-medium leading-relaxed ${isDarkMode ? 'text-white/95' : 'text-gray-800'}`}>
                  <strong>Introducing Avatar 2.0!</strong> Experience advanced AI capabilities for mathematics, coding, and complex problem-solving. Try it now!
                </p>
              </div>
            </div>

            {/* Actions: Switch Button & Dismiss */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={onSwitchToAvatar2}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 shadow-lg transform active:scale-95 flex items-center justify-center gap-1.5 ${
                  isAlreadyAvatar2
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white hover:shadow-cyan-500/30 hover:scale-105 hover:brightness-110'
                }`}
              >
                {isAlreadyAvatar2 ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Avatar 2.0 Active</span>
                  </>
                ) : (
                  <>
                    <span>Switch to Avatar 2.0</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isDarkMode
                    ? 'text-white/60 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
                title="Dismiss announcement"
                aria-label="Dismiss announcement"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
