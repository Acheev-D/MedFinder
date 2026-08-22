import React from 'react';
import {
  Activity,
  Zap,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Clapperboard
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
    resetSimulator
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
    <header className="w-full max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg shadow-blue-900/5 p-4 md:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Main Title & Architecture Tag */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                <Activity className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
                Live Split-Screen Interactive Simulator
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Inventory Software Requirement
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Reverse-Demand Real-Time Medicine Verification
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Connecting patients to nearby pharmacists via instant 1-tap counter pings, eliminating out-of-stock pharmacy runs.
            </p>
          </div>

          {/* Quick Interactive Demo Flow Triggers */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Quick Scenarios:
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={runScenarioGenericSavings}
                className="py-1.5 px-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1 transition-all"
                title="Scenario: Augmentin search + Generic ON -> Pharmacist offers generic substitute (73% savings)"
              >
                <Zap className="w-3.5 h-3.5 text-teal-600" />
                <span>1. Generic Savings Flow</span>
              </button>

              <button
                onClick={runScenarioExactBrand}
                className="py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-brand-800 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-all"
                title="Scenario: Crocin 650 search + Generic OFF -> Exact brand only"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                <span>2. Exact Brand Flow</span>
              </button>

              <button
                onClick={runScenarioOutOfStock}
                className="py-1.5 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-1 transition-all"
                title="Scenario: Out of stock -> Radius expansion"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                <span>3. Radius Expand Flow</span>
              </button>

              {onReplaySplash && (
                <button
                  onClick={onReplaySplash}
                  className="py-1.5 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Replay 2.5s Intro Splash Animation"
                >
                  <Clapperboard className="w-3.5 h-3.5 text-indigo-600" />
                  <span>🎬 Intro</span>
                </button>
              )}

              <button
                onClick={resetSimulator}
                className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
