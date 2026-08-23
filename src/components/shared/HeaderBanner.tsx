import React from 'react';
import {
  Activity,
  Zap,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Clapperboard,
  Moon,
  Sun
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { MEDICINE_CATALOG } from '../../data/medicines';

interface HeaderBannerProps {
  onReplaySplash?: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ onReplaySplash }) => {
  const {
    selectMedicine,
    setAllowAlternatives,
    startStoreCheck,
    resetSimulator,
    isNightMode,
    toggleNightMode
  } = useSimulator();

  // Demo Scenario 1: Prescribe Augmentin -> Allow Alternatives ON -> Pharmacist Offers Generic Amoxyclav (Save 73%)
  const runScenarioGenericSavings = () => {
    resetSimulator();
    setTimeout(() => {
      const med = MEDICINE_CATALOG[0]; // Augmentin
      selectMedicine(med);
      setAllowAlternatives(true);
      setTimeout(() => {
        startStoreCheck();
      }, 50);
    }, 100);
  };

  // Demo Scenario 2: Prescribe Crocin 650 -> Allow Alternatives OFF -> Pharmacist Confirms Exact Brand Only
  const runScenarioExactBrand = () => {
    resetSimulator();
    setTimeout(() => {
      const med = MEDICINE_CATALOG[1]; // Crocin
      selectMedicine(med);
      setAllowAlternatives(false);
      setTimeout(() => {
        startStoreCheck();
      }, 50);
    }, 100);
  };

  // Demo Scenario 3: Azithral 500 -> Out of Stock Scenario
  const runScenarioOutOfStock = () => {
    resetSimulator();
    setTimeout(() => {
      const med = MEDICINE_CATALOG[2]; // Azithral
      selectMedicine(med);
      setAllowAlternatives(false);
      setTimeout(() => {
        startStoreCheck();
      }, 50);
    }, 100);
  };

  return (
    <header className="w-full max-w-7xl mx-auto px-4 pt-4 pb-2 transition-colors duration-300">
      <div className={`backdrop-blur-xl rounded-3xl border p-4 md:p-5 transition-all duration-300 ${
        isNightMode
          ? 'bg-slate-900/90 border-slate-800 shadow-2xl shadow-blue-950/40 text-slate-100'
          : 'bg-white/80 border-white/80 shadow-lg shadow-blue-900/5 text-slate-900'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Main Title & Architecture Tag */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                isNightMode
                  ? 'bg-blue-950/80 text-blue-300 border-blue-800/80'
                  : 'bg-brand-50 text-brand-700 border-brand-200'
              }`}>
                <Activity className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                Live Split-Screen Interactive Simulator
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
                isNightMode
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero Inventory Software Requirement
              </span>
            </div>

            <h1 className={`text-xl md:text-2xl font-black tracking-tight transition-colors ${
              isNightMode ? 'text-white' : 'text-slate-900'
            }`}>
              Reverse-Demand Real-Time Medicine Verification
            </h1>
            <p className={`text-xs md:text-sm font-medium transition-colors ${
              isNightMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Connecting patients to nearby pharmacists via instant counter verification, eliminating out-of-stock pharmacy runs.
            </p>
          </div>

          {/* Quick Interactive Demo Flow Triggers & Night Theme Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/40">
            <span className={`text-[11px] font-bold uppercase tracking-wider shrink-0 transition-colors ${
              isNightMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Quick Scenarios:
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={runScenarioGenericSavings}
                className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isNightMode
                    ? 'bg-teal-950/60 hover:bg-teal-900 text-teal-300 border-teal-800/70'
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                }`}
                title="Scenario: Augmentin search + Generic ON -> Pharmacist offers generic substitute (73% savings)"
              >
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>1. Generic Savings Flow</span>
              </button>

              <button
                onClick={runScenarioExactBrand}
                className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isNightMode
                    ? 'bg-blue-950/60 hover:bg-blue-900 text-blue-300 border-blue-800/70'
                    : 'bg-blue-50 hover:bg-blue-100 text-brand-800 border-blue-200'
                }`}
                title="Scenario: Crocin 650 search + Generic OFF -> Exact brand only"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>2. Exact Brand Flow</span>
              </button>

              <button
                onClick={runScenarioOutOfStock}
                className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isNightMode
                    ? 'bg-purple-950/60 hover:bg-purple-900 text-purple-300 border-purple-800/70'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
                }`}
                title="Scenario: Out of stock -> Radius expansion"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>3. Radius Expand Flow</span>
              </button>

              {onReplaySplash && (
                <button
                  onClick={onReplaySplash}
                  className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isNightMode
                      ? 'bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border-indigo-800/70'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                  }`}
                  title="Replay 2.5s Intro Splash Animation"
                >
                  <Clapperboard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>🎬 Intro</span>
                </button>
              )}

              <button
                onClick={resetSimulator}
                className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isNightMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* Outer Workspace Theme Toggle Button (🌙 / ☀️) */}
              <button
                onClick={toggleNightMode}
                className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer ${
                  isNightMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-amber-500/10'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
                }`}
                title={isNightMode ? 'Switch to Light Workspace' : 'Switch to Night Workspace'}
              >
                {isNightMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
