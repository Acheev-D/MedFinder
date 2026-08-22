import React from 'react';
import {
  X,
  MapPin,
  Navigation,
  Phone,
  Clock,
  ShieldCheck,
  Store
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const DirectionsModal: React.FC = () => {
  const {
    isDirectionsOpen,
    setIsDirectionsOpen,
    activeOffer,
    pickupCode,
    savedUntilTimeStr
  } = useSimulator();

  if (!isDirectionsOpen || !activeOffer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Walking & Driving Route</h3>
              <p className="text-[11px] text-slate-500">Destination: {activeOffer.pharmacyName}</p>
            </div>
          </div>

          <button
            onClick={() => setIsDirectionsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Visualization Simulation */}
        <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-200">
          {/* Simulated Map Canvas Roads & Buildings */}
          <div className="absolute inset-0 bg-[#e5e9ec] opacity-90">
            {/* Grid roads */}
            <div className="absolute top-1/2 left-0 right-0 h-8 bg-white border-y border-slate-300/80 -rotate-6 transform -translate-y-4"></div>
            <div className="absolute top-0 bottom-0 left-1/3 w-7 bg-white border-x border-slate-300/80"></div>
            <div className="absolute top-0 bottom-0 right-1/4 w-6 bg-white border-x border-slate-300/80 -rotate-12"></div>
            
            {/* Route path line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 180">
              <path
                d="M 60 140 Q 130 110, 160 80 T 320 50"
                fill="none"
                stroke="#2563eb"
                strokeWidth="5"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            </svg>

            {/* Start Pin (Patient) */}
            <div className="absolute bottom-6 left-12 transform -translate-x-1/2 flex flex-col items-center">
              <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-bold shadow-md">
                You (Current)
              </span>
              <div className="w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-md"></div>
            </div>

            {/* Destination Pin (Pharmacy) */}
            <div className="absolute top-6 right-16 transform -translate-x-1/2 flex flex-col items-center">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold shadow-md">
                {activeOffer.pharmacyName}
              </span>
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white border-2 border-white shadow-md flex items-center justify-center">
                <Store className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Quick Route Meta Floating Banner */}
          <div className="absolute bottom-2 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2 border border-slate-200/80 shadow-md flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{activeOffer.distance}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700 font-semibold">3-4 mins walk</span>
            </div>
            <span className="text-[11px] font-bold text-brand-600 font-mono">Token #{pickupCode}</span>
          </div>
        </div>

        {/* Turn by Turn & Destination Details */}
        <div className="p-4 space-y-3">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">{activeOffer.pharmacyName}</div>
                <div className="text-[11px] text-slate-500">{activeOffer.address}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-[11px]">
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Hold active until <strong>{savedUntilTimeStr}</strong>
              </span>
              <a
                href={`tel:${activeOffer.phone}`}
                className="flex items-center gap-1 text-brand-600 font-bold hover:underline"
              >
                <Phone className="w-3 h-3" />
                {activeOffer.phone}
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Store counter is alerted and holding 1 unit of <strong>{activeOffer.medicineName}</strong>.</span>
          </div>

          <button
            onClick={() => setIsDirectionsOpen(false)}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Done • Back to Reservation Pass
          </button>
        </div>
      </div>
    </div>
  );
};
