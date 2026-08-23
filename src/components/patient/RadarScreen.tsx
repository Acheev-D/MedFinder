import React from 'react';
import {
  MapPin,
  Store,
  Clock
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const RadarScreen: React.FC = () => {
  const {
    selectedMedicine,
    timerSeconds,
    searchRadius,
    activeStoreCount,
    expandRadius,
    status,
    fastForwardTimer,
    t
  } = useSimulator();

  const progressPercent = ((60 - timerSeconds) / 60) * 100;
  const isTimedOut = status === 'NO_STORES_FOUND' || timerSeconds === 0;

  return (
    <div className="flex-1 p-4 flex flex-col justify-between animate-fade-in">
      <div className="space-y-4">

        {/* Status Header */}
        <div className="text-center pt-2">
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {isTimedOut
              ? (t.timeoutHeader || 'No Quick Replies Nearby')
              : t.askingStores(activeStoreCount)}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.lookingForWithin(selectedMedicine?.brandName || '', searchRadius)}
          </p>
        </div>

        {/* Gentle Radar Ripple Wave Animation Area */}
        <div className="relative h-56 flex items-center justify-center my-2 overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/60 via-indigo-50/40 to-white border border-blue-100/60 shadow-inner">
          {/* Ambient Soothing Sky Blue / Lavender Gradient Orbs */}
          <div className="absolute w-40 h-40 rounded-full bg-blue-400/10 blur-2xl pointer-events-none"></div>
          <div className="absolute w-32 h-32 rounded-full bg-purple-400/10 blur-2xl pointer-events-none"></div>

          {!isTimedOut ? (
            <div className="relative flex items-center justify-center">
              {/* Soothing Ripple 1 */}
              <div className="absolute w-48 h-48 rounded-full border border-blue-400/30 bg-blue-400/5 animate-ripple-1"></div>
              {/* Soothing Ripple 2 */}
              <div className="absolute w-36 h-36 rounded-full border border-indigo-400/30 bg-indigo-400/5 animate-ripple-2"></div>
              {/* Soothing Ripple 3 */}
              <div className="absolute w-24 h-24 rounded-full border border-sky-400/40 bg-sky-400/10 animate-ripple-3"></div>

              {/* Center Humanized Beacon */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 via-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/30 flex items-center justify-center text-white">
                <div className="w-full h-full rounded-full bg-brand-600/90 flex flex-col items-center justify-center">
                  <Store className="w-6 h-6 text-white animate-bounce-subtle" />
                </div>
              </div>

              {/* Floating Orbiting Store Indicators */}
              <div className="absolute -top-12 -left-14 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-700 border border-slate-200/80 shadow-md flex items-center gap-1.5 animate-pulse-slow">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Apollo (800m)</span>
              </div>

              <div className="absolute -bottom-10 -right-12 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-700 border border-slate-200/80 shadow-md flex items-center gap-1.5 animate-pulse-slow">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>MedPlus (1.2km)</span>
              </div>

              <div className="absolute -bottom-12 -left-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-700 border border-slate-200/80 shadow-md flex items-center gap-1.5 animate-pulse-slow">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Care Point (2.1km)</span>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 z-10">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2 border border-slate-200">
                <Store className="w-7 h-7" />
              </div>
              <p className="text-xs font-semibold text-slate-700">{t.timeoutHeader}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.timeoutDesc}</p>
            </div>
          )}
        </div>

        {/* Smooth 60-Second Countdown Progress Bar */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              {t.searchingStatus}
            </span>
            <span className="font-mono font-bold text-brand-700">
              {t.timeRemaining(timerSeconds)}
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${100 - progressPercent}%` }}
            ></div>
          </div>

          {timerSeconds > 10 && (
            <div className="flex justify-end pt-0.5">
              <button
                onClick={fastForwardTimer}
                className="text-[10px] text-brand-600 hover:underline font-semibold"
              >
                Fast-forward ⚡
              </button>
            </div>
          )}
        </div>

        {/* Radius Expansion Card */}
        <div className={`rounded-2xl p-3.5 border transition-all ${
          isTimedOut
            ? 'bg-gradient-to-br from-indigo-50 via-blue-50 to-white border-indigo-300 shadow-md ring-2 ring-indigo-500/20 animate-slide-up'
            : 'bg-slate-50/80 border-slate-200/80'
        }`}>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-800">
                {t.timeoutHeader}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {t.timeoutDesc}
              </p>
            </div>
          </div>

          {searchRadius === '3km' && (
            <button
              onClick={expandRadius}
              className="mt-3 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>📍 {t.expandRadiusBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
