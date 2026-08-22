import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';

interface SplashScreenProps {
  onComplete?: () => void;
  isOpen?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, isOpen = true }) => {
  const [phase, setPhase] = useState<number>(1); // 1: Beacon (0-0.8s), 2: Morph (0.8-1.6s), 3: Tagline (1.6-2.2s), 4: Ping & Fade (2.2-2.5s)
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setIsMounted(false);
      return;
    }

    setIsMounted(true);
    setPhase(1);
    setIsFadingOut(false);

    // Initial subtle audio chime
    try {
      sound.playInquiryChime();
    } catch {}

    // Phase 2: Morphing to Health-Heart 'H' (at 0.8s)
    const t1 = setTimeout(() => {
      setPhase(2);
    }, 800);

    // Phase 3: Tagline Reveal (at 1.6s)
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 1600);

    // Phase 4: Final Ping flash (at 2.2s)
    const t3 = setTimeout(() => {
      setPhase(4);
    }, 2200);

    // Fade out (at 2.5s)
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Unmount (at 2.9s)
    const t5 = setTimeout(() => {
      setIsMounted(false);
      if (onComplete) onComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen, onComplete]);

  if (!isMounted) return null;

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsMounted(false);
      if (onComplete) onComplete();
    }, 200);
  };

  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-400 ease-out select-none rounded-[2.2rem] ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } bg-gradient-to-br from-blue-50/98 via-indigo-50/90 to-purple-100/95 backdrop-blur-xl`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {/* Ambient Moving Blur Orbs inside Phone Frame */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-400/25 blur-2xl animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-400/25 blur-2xl animate-pulse pointer-events-none"></div>
      <div className="absolute top-1/3 right-4 w-40 h-40 rounded-full bg-teal-300/20 blur-xl pointer-events-none"></div>

      {/* Skip Button inside Phone Frame */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 text-[11px] font-semibold backdrop-blur-md border border-slate-200 shadow-xs transition-all z-20"
      >
        Skip ✕
      </button>

      {/* Central Animation Stage */}
      <div className="relative flex flex-col items-center justify-center space-y-5 z-10 px-4">
        
        {/* Concentric Pulse Rings */}
        <div className="relative flex items-center justify-center">
          {/* Ring 1 (Phase 1) */}
          <div
            className={`absolute w-24 h-24 rounded-full border-2 border-brand-400/60 transition-all duration-1000 ${
              phase >= 1 ? 'scale-[2.4] opacity-0' : 'scale-100 opacity-80'
            }`}
          ></div>

          {/* Ring 2 (Phase 2) */}
          <div
            className={`absolute w-24 h-24 rounded-full border-2 border-indigo-500/50 transition-all duration-1000 delay-300 ${
              phase >= 2 ? 'scale-[2.8] opacity-0' : 'scale-75 opacity-0'
            }`}
          ></div>

          {/* Ring 3 (Phase 3) */}
          <div
            className={`absolute w-24 h-24 rounded-full border border-teal-400/40 transition-all duration-1000 delay-500 ${
              phase >= 3 ? 'scale-[3.2] opacity-0' : 'scale-50 opacity-0'
            }`}
          ></div>

          {/* Central Animated Vector Emblem */}
          <div
            className={`relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl transition-all duration-700 ${
              phase === 4
                ? 'scale-105 ring-4 ring-white/90 shadow-blue-500/40'
                : 'scale-100'
            } ${
              phase === 1
                ? 'bg-gradient-to-tr from-sky-500 to-blue-600 shadow-sky-500/30'
                : 'bg-gradient-to-tr from-brand-600 via-blue-600 to-indigo-600 shadow-blue-600/35'
            }`}
          >
            {/* Shimmer Ping Flash Overlay (Phase 4) */}
            {phase === 4 && (
              <div className="absolute inset-0 rounded-3xl bg-white/40 animate-ping pointer-events-none"></div>
            )}

            {/* Morphing SVG Icon */}
            <svg
              viewBox="0 0 100 100"
              className="w-14 h-14 text-white drop-shadow-md transition-all duration-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {phase === 1 ? (
                /* Phase 1: Radar Signal Beacon Tower */
                <g className="animate-fade-in">
                  <path d="M50 22v56" />
                  <path d="M35 78l15-22 15 22" />
                  <circle cx="50" cy="22" r="5" fill="white" />
                  <path d="M30 35a26 26 0 0 1 40 0" strokeDasharray="4 4" />
                  <path d="M20 25a40 40 0 0 1 60 0" strokeDasharray="5 5" />
                </g>
              ) : (
                /* Phase 2+: Interlocking Health-Heart 'H' Cross Vector */
                <g className="animate-scale-in">
                  {/* Left Column of 'H' */}
                  <path
                    d="M32 25v50"
                    className="transition-all duration-700"
                    strokeWidth="8"
                  />
                  {/* Right Column of 'H' */}
                  <path
                    d="M68 25v50"
                    className="transition-all duration-700"
                    strokeWidth="8"
                  />
                  {/* Center Heart Bar connecting the H */}
                  <path
                    d="M32 50c6-10 14-6 18-2 4-4 12-8 18 2"
                    strokeWidth="7.5"
                    className="transition-all duration-700 text-teal-200"
                  />
                  {/* Heart bottom apex */}
                  <path
                    d="M32 50c8 12 18 20 18 20s10-8 18-20"
                    strokeWidth="7.5"
                    className="transition-all duration-700 text-teal-200"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Brand Text & Tagline Reveal (Phase 3 & 4) */}
        <div
          className={`text-center space-y-1.5 transition-all duration-700 transform ${
            phase >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Med<span className="text-brand-600">Ping</span>
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          <p className="text-xs font-semibold text-slate-600 max-w-[240px] mx-auto tracking-tight leading-relaxed">
            "Help is here, closer than you think."
          </p>

          <div className="pt-1.5 flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-brand-500 via-teal-400 to-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Subtext Footer */}
      <div className="absolute bottom-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
        Reverse-Demand Medicine Network
      </div>
    </div>
  );
};
