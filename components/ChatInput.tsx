import React, { useState, useRef, useEffect } from 'react';
import { avatarService } from '../services/avatarService.ts';
import { AvatarModelId } from '../types.ts';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
  placeholder: string;
  selectedModel?: AvatarModelId;
}

// Declaration for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isDarkMode,
  placeholder,
  selectedModel = 'avatar',
}) => {
  const [content, setContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [autoCorrect, setAutoCorrect] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [feedbackBadge, setFeedbackBadge] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const isStoppingManuallyRef = useRef(false);
  const isSubmittingRef = useRef(false);

  // Model display name for notifications
  const modelDisplayName = selectedModel === 'avatar-2.0' ? 'Avatar 2.0' : 'Avatar 1.2';

  // Resize textarea on content change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content, interimTranscript]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const showTemporaryFeedback = (msg: string) => {
    setFeedbackBadge(msg);
    setTimeout(() => {
      setFeedbackBadge((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const showTemporaryError = (msg: string) => {
    setSpeechError(msg);
    setTimeout(() => {
      setSpeechError((prev) => (prev === msg ? null : prev));
    }, 5000);
  };

  // Enhance given text via grammar correction service on manual button click
  const handleEnhanceText = async (textToEnhance: string, isFromVoice = false) => {
    if (!textToEnhance.trim()) return;

    setIsEnhancing(true);
    try {
      const corrected = await avatarService.correctGrammar(textToEnhance.trim());
      if (corrected && corrected !== textToEnhance.trim()) {
        setContent(corrected);
        showTemporaryFeedback(
          isFromVoice
            ? '✨ Speech auto-corrected into natural English!'
            : '✨ English refined & enhanced!'
        );
      } else {
        setContent(textToEnhance.trim());
        if (!isFromVoice) {
          showTemporaryFeedback('✓ Text is already clear and grammatically sound');
        }
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      setContent(textToEnhance.trim());
    } finally {
      setIsEnhancing(false);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  };

  // Initialize or start speech recognition
  const startSpeechRecognition = () => {
    setSpeechError(null);
    const windowObj = window as unknown as IWindow;
    const SpeechRecognition =
      windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showTemporaryError(
        'Voice input is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let accumulatedFinal = content ? content.trim() + ' ' : '';
      let currentSessionTranscript = '';
      isStoppingManuallyRef.current = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (finalChunk) {
          accumulatedFinal += finalChunk;
          currentSessionTranscript += finalChunk;
          setContent(accumulatedFinal.trim());
        }

        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition Error:', event.error);
        if (event.error === 'not-allowed') {
          showTemporaryError(
            'Microphone access was denied. Please allow microphone permissions in your browser settings.'
          );
        } else if (event.error === 'no-speech') {
          // harmless timeout if silence
        } else if (event.error === 'network') {
          showTemporaryError('Microphone network error. Please check your connection.');
        } else {
          showTemporaryError(`Voice input issue: ${event.error}`);
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = async () => {
        setIsListening(false);
        setInterimTranscript('');

        const finalRecordedText = (accumulatedFinal + ' ' + currentSessionTranscript).trim();

        if (finalRecordedText) {
          if (autoCorrect) {
            await handleEnhanceText(finalRecordedText, true);
          } else {
            setContent(finalRecordedText);
            showTemporaryFeedback('✓ Spoken speech inserted into input field');
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      showTemporaryError('Failed to initialize microphone. Please check permissions.');
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    isStoppingManuallyRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          // ignore
        }
      }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Synchronous submission flow with Auto-Correct guarantee:
  // User Prompt → Auto-Correct → Corrected Prompt → Submit to Model → Generate AI Response
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Prevent duplicate submissions while loading or correcting
    if (isSubmittingRef.current || isLoading || isCorrecting || isEnhancing) {
      return;
    }

    if (isListening) {
      stopSpeechRecognition();
    }

    const trimmed = content.trim();
    if (!trimmed) return;

    if (autoCorrect) {
      // Temporarily pause submission and correct grammar first
      isSubmittingRef.current = true;
      setIsCorrecting(true);

      try {
        const corrected = await avatarService.correctGrammar(trimmed);
        const finalPrompt = (corrected && corrected.trim()) ? corrected.trim() : trimmed;

        // Automatically replace original prompt with corrected prompt in UI
        setContent(finalPrompt);

        // Submit the corrected prompt directly to the AI model
        onSendMessage(finalPrompt);

        // Reset input state after submission
        setContent('');
        setInterimTranscript('');
        setFeedbackBadge(null);
      } catch (err) {
        console.error('Auto-correct error on submit, submitting original prompt:', err);
        // On error, submit trimmed prompt gracefully without duplication
        onSendMessage(trimmed);
        setContent('');
      } finally {
        setIsCorrecting(false);
        isSubmittingRef.current = false;
      }
    } else {
      // Auto-correct disabled: submit original prompt normally
      isSubmittingRef.current = true;
      try {
        onSendMessage(trimmed);
        setContent('');
        setInterimTranscript('');
        setFeedbackBadge(null);
      } finally {
        isSubmittingRef.current = false;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isBusy = isLoading || isEnhancing || isCorrecting;

  const inputBg = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-white/[0.08]' : 'border-gray-200';
  const inputFocusBg = isDarkMode ? 'focus-within:bg-[#222]' : 'focus-within:bg-gray-50';
  const inputText = isDarkMode ? 'text-white' : 'text-gray-900';
  const placeholderColor = isDarkMode ? 'placeholder:text-white/30' : 'placeholder:text-gray-400';
  const footerBg = isDarkMode
    ? 'bg-[#0a0a0a]'
    : 'bg-gradient-to-br from-gray-50 via-white to-blue-50';

  return (
    <div className={`w-full ${footerBg} z-40 px-4 md:px-0 transition-colors duration-500`}>
      <div className="max-w-3xl mx-auto pt-1 pb-3 md:pb-5 flex flex-col items-center">
        {/* Error notification */}
        {speechError && (
          <div className="w-full mb-2 p-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{speechError}</span>
            </div>
            <button
              onClick={() => setSpeechError(null)}
              className="text-red-400 hover:text-red-300 ml-2 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Feedback Badge / Status Notification */}
        {feedbackBadge && !isCorrecting && (
          <div className="w-full mb-2 p-2 px-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold">{feedbackBadge}</span>
            </div>
            <button
              onClick={() => setFeedbackBadge(null)}
              className="text-cyan-400 hover:text-cyan-300 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State: Auto-correcting prompt before submitting to AI */}
        {isCorrecting && (
          <div className="w-full mb-2 p-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 border border-cyan-500/30 text-xs flex items-center justify-between shadow-lg animate-pulse">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="font-semibold text-cyan-400">
                Correcting prompt for {modelDisplayName}...
              </span>
            </div>
            <span className="text-[11px] text-cyan-300/80 italic hidden sm:inline">
              Refining grammar before submission
            </span>
          </div>
        )}

        {/* Active Listening Status Indicator */}
        {isListening && (
          <div className="w-full mb-2 p-2.5 px-4 rounded-2xl bg-gradient-to-r from-red-500/15 via-rose-500/15 to-pink-500/15 border border-red-500/30 text-xs flex items-center justify-between shadow-lg animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="font-semibold text-red-400">
                Listening... Speak naturally (click mic to stop & enhance)
              </span>
            </div>
            {interimTranscript && (
              <span className="italic truncate max-w-[200px] md:max-w-xs text-white/70">
                "{interimTranscript}"
              </span>
            )}
          </div>
        )}

        {/* Input Controls Bar: Auto-Correct Toggle & Manual Enhance */}
        <div className="w-full flex items-center justify-between px-2 mb-1.5 text-xs">
          <div className="flex items-center gap-2">
            {/* Auto-Correct Toggle */}
            <button
              type="button"
              onClick={() => setAutoCorrect(!autoCorrect)}
              disabled={isBusy}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-300 border ${
                autoCorrect
                  ? isDarkMode
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25'
                    : 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100'
                  : isDarkMode
                  ? 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                  : 'bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-700'
              }`}
              title="Automatically correct broken English, grammar, and enhance speech or typed prompts before submission"
            >
              <span className="text-xs">✨</span>
              <span>Auto-Correct:</span>
              <span className={`font-bold ${autoCorrect ? 'text-cyan-400' : ''}`}>
                {autoCorrect ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Enhance Button for Typed Text */}
            {content.trim() && !isBusy && !isListening && (
              <button
                type="button"
                onClick={() => handleEnhanceText(content)}
                disabled={isBusy}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-300 border ${
                  isDarkMode
                    ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 hover:border-indigo-400'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                }`}
                title="Refine grammar, spelling, and sentence clarity"
              >
                <span>✨ Refine English</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Input Form */}
        <form
          onSubmit={handleSubmit}
          className={`w-full flex items-end ${inputBg} border ${
            isListening
              ? 'border-red-500/50 shadow-red-500/20'
              : isCorrecting
              ? 'border-cyan-500/60 shadow-cyan-500/20'
              : inputBorder
          } rounded-[24px] md:rounded-[28px] overflow-hidden shadow-xl hover:shadow-2xl ${inputFocusBg} transition-all duration-300 ${
            isDarkMode
              ? 'focus-within:ring-2 focus-within:ring-blue-500/30'
              : 'focus-within:ring-2 focus-within:ring-cyan-400/30'
          }`}
        >
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : isCorrecting
                ? 'Correcting prompt before submitting to AI...'
                : isEnhancing
                ? 'Enhancing into clear, grammatically correct English...'
                : placeholder
            }
            rows={1}
            className={`flex-1 bg-transparent border-none outline-none ${inputText} p-3 md:p-4 pl-5 resize-none text-[14px] md:text-[15px] ${placeholderColor} custom-scrollbar leading-relaxed min-h-[44px] max-h-[150px] transition-all`}
            disabled={isBusy}
          />

          {/* Action Buttons: Voice Mic & Send */}
          <div className="p-2 md:p-3 flex items-center gap-1.5 flex-shrink-0">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={isBusy}
              className={`p-3 rounded-full transition-all duration-300 transform active:scale-95 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 scale-105 animate-pulse'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white hover:scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 hover:scale-105'
              }`}
              title={isListening ? 'Stop listening (Voice Input)' : 'Speak prompt (Voice Input)'}
              aria-label={isListening ? 'Stop recording voice' : 'Start recording voice'}
            >
              {isListening ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-white animate-bounce"
                >
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!content.trim() || isBusy}
              className={`p-3 rounded-full transition-all duration-300 transform ${
                content.trim() && !isBusy
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white hover:shadow-lg hover:scale-110 scale-100'
                    : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-110 scale-100'
                  : isDarkMode
                  ? 'bg-white/5 text-white/10 scale-90 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-300 scale-90 cursor-not-allowed'
              }`}
              title="Send message"
              aria-label="Send message"
            >
              {isBusy ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </div>
        </form>

        <div className="mt-3 flex items-center justify-between w-full max-w-xl px-2">
          <p
            className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${
              isDarkMode ? 'text-white/20' : 'text-gray-400'
            }`}
          >
            Designed by YK ❤️
          </p>

          <p
            className={`text-[10px] tracking-wide transition-colors ${
              isDarkMode ? 'text-white/30' : 'text-gray-400'
            }`}
          >
            Voice Input • Auto-English Correction • {modelDisplayName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
