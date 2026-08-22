import React from 'react';
import type { ReactNode } from 'react';
import { Wifi, Battery, Signal, ShieldCheck, HeartPulse } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { AuthBottomSheet } from './AuthBottomSheet';
import { SplashScreen } from '../shared/SplashScreen';

interface MobileFrameProps {
  children: ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { status, resetSimulator, showSplash, setShowSplash } = useSimulator();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center">
      {/* Mobile Device Frame Mockup: 390px x 844px */}
      <div className="relative w-[390px] h-[844px] bg-slate-900 rounded-[2.8rem] p-3 shadow-2xl shadow-blue-900/20 border-4 border-slate-700/60 ring-1 ring-white/20 transition-all duration-300">
        {/* Outer Phone Shell Speaker & Camera */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center space-x-2">
          {/* Dynamic Island pill */}
          <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-between px-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></span>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-slate-700"></div>
          </div>
        </div>

        {/* Inner Screen Surface */}
        <div className="relative w-full h-full bg-slate-50 rounded-[2.2rem] overflow-hidden flex flex-col font-sans select-none text-slate-900 border border-slate-200/80">
          
          {/* Status Bar */}
          <div className="pt-2 px-6 pb-1.5 flex justify-between items-center text-xs font-semibold text-slate-700 tracking-tight z-20 bg-white/70 backdrop-blur-sm border-b border-slate-100">
            <span className="text-[13px] font-bold text-slate-800">{currentTime}</span>
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* App Brand Header */}
          <div className="px-4 py-2.5 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 leading-none">
                  MedFinder Live
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Instant Counter Verification</p>
              </div>
            </div>

            {status !== 'IDLE' && (
              <button
                onClick={resetSimulator}
                title="Reset Patient Search"
                className="text-[11px] font-medium text-slate-500 hover:text-brand-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Screen Content Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-gradient-to-b from-slate-50 to-blue-50/30 flex flex-col">
            {children}
            {/* Just-In-Time Phone Auth Bottom Sheet Modal */}
            <AuthBottomSheet />
            {/* Scoped Patient Mobile Intro Splash Screen */}
            <SplashScreen isOpen={showSplash} onComplete={() => setShowSplash(false)} />
          </div>

          {/* Bottom Home Indicator */}
          <div className="py-2 flex justify-center items-center bg-white/80 backdrop-blur-sm border-t border-slate-100 z-20">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Viewport Subtitle Label */}
      <div className="mt-3 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-700 border border-blue-200/60 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          Patient Mobile Experience (390×844)
        </span>
      </div>
    </div>
  );
};
