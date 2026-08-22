import React from 'react';
import { SimulatorProvider, useSimulator } from './context/SimulatorContext';
import { HeaderBanner } from './components/shared/HeaderBanner';
import { MobileFrame } from './components/patient/MobileFrame';
import { SearchScreen } from './components/patient/SearchScreen';
import { RadarScreen } from './components/patient/RadarScreen';
import { MatchScreen } from './components/patient/MatchScreen';
import { ReservationScreen } from './components/patient/ReservationScreen';
import { CompletedScreen } from './components/patient/CompletedScreen';
import { PharmacistTerminal } from './components/pharmacist/PharmacistTerminal';
import { DirectionsModal } from './components/shared/DirectionsModal';
import {
  ArrowLeftRight,
  ShieldCheck,
  Store,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SimulatorWorkspace: React.FC = () => {
  const {
    status,
    isTerminalCollapsed,
    toggleTerminalCollapse,
    incomingInquiries,
    replaySplash
  } = useSimulator();

  const pendingPingsCount = incomingInquiries.filter(i => i.status === 'PENDING').length;

  // Render dynamic screen inside mobile frame based on reactive status
  const renderPatientScreen = () => {
    switch (status) {
      case 'IDLE':
        return <SearchScreen />;
      case 'CHECKING_STORES':
      case 'NO_STORES_FOUND':
        return <RadarScreen />;
      case 'STORE_FOUND':
        return <MatchScreen />;
      case 'RESERVED':
        return <ReservationScreen />;
      case 'COMPLETED':
        return <CompletedScreen />;
      default:
        return <SearchScreen />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-x-hidden flex flex-col justify-between">
      {/* Soft Ambient Frosted Orbs in Top Corners */}
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-3xl pointer-events-none -z-10"></div>

      {/* Main Top Header Banner with Scenarios & Patient Splash Replay */}
      <HeaderBanner onReplaySplash={replaySplash} />

      {/* Split-Screen Workspace Container with Smooth Collapse Transitions */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 lg:gap-8 transition-all duration-300 ease-in-out relative">
        
        {/* Left Viewport: Patient Mobile Frame (Splash Screen runs inside this frame exclusively) */}
        <div className={`transition-all duration-300 ease-in-out flex justify-center w-full ${
          isTerminalCollapsed
            ? 'max-w-xl mx-auto'
            : 'flex-1 max-w-md xl:max-w-none'
        }`}>
          <MobileFrame>
            {renderPatientScreen()}
          </MobileFrame>
        </div>

        {/* Center Divider & Collapse / Expand Toggle Button */}
        <div className="hidden xl:flex flex-col items-center justify-center self-center py-6 px-1 z-20">
          <button
            onClick={toggleTerminalCollapse}
            title={isTerminalCollapsed ? 'Expand Pharmacist Counter Panel' : 'Collapse Pharmacist Panel'}
            className="w-9 h-9 rounded-full bg-white border border-slate-300 hover:border-brand-500 shadow-md flex items-center justify-center text-slate-600 hover:text-brand-600 hover:scale-110 active:scale-95 transition-all"
          >
            {isTerminalCollapsed ? (
              <ChevronLeft className="w-5 h-5 text-brand-600" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          
          <div className="w-px h-12 bg-slate-200 my-2"></div>
          
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-brand-600">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>

        {/* Right Viewport: Pharmacist Counter Terminal (Always immediately visible and interactive from second 0) */}
        {isTerminalCollapsed ? (
          /* Minimalist Floating Trigger Tab when Collapsed */
          <div className="fixed bottom-6 right-6 xl:bottom-8 xl:right-8 z-40 animate-slide-up">
            <button
              onClick={toggleTerminalCollapse}
              className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl border border-slate-700 flex items-center gap-2.5 transition-all group hover:scale-105 active:scale-95"
            >
              <div className="w-7 h-7 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>🏥 Show Counter Panel</span>
                  {pendingPingsCount > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 animate-pulse">
                      🟢 {pendingPingsCount} Ping{pendingPingsCount === 1 ? '' : 's'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-normal">Ready</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-normal">
                  Tap to expand POS terminal
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* Expanded Full Pharmacist Counter Terminal */
          <div className="flex-1 flex justify-center w-full transition-all duration-300 ease-in-out animate-fade-in">
            <PharmacistTerminal />
          </div>
        )}
      </main>

      {/* Simulated Directions Modal */}
      <DirectionsModal />

      {/* Bottom Footer Information Bar */}
      <footer className="w-full bg-white/70 backdrop-blur-md border-t border-slate-200/80 py-3.5 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">Reverse-Demand Verification Network Active</span>
            <span>•</span>
            <span>In-Memory Reactive State Engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% CDSCO Compliant
            </span>
            <span>•</span>
            <span>Single-Page Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SimulatorProvider>
      <SimulatorWorkspace />
    </SimulatorProvider>
  );
}
