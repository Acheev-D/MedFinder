import React, { useState } from 'react';
import {
  Store,
  Copy,
  Check,
  Navigation,
  FileText
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const ReservationScreen: React.FC = () => {
  const {
    activeOffer,
    pickupCode,
    savedUntilTimeStr,
    setIsDirectionsOpen,
    cancelHold,
    t
  } = useSimulator();

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeOffer) return null;

  return (
    <div className="flex-1 p-4 flex flex-col justify-between animate-slide-up">
      <div className="space-y-4">

        {/* Calm Status Header */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping-slow"></span>
            <span>{t.pickupPassTitle}</span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
            {t.pickupPassTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.passInstruction}
          </p>
        </div>

        {/* Calm Reservation Pass Card (Ticket Design) */}
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-white/90" />
                <div>
                  <h3 className="text-sm font-bold leading-tight">{activeOffer.pharmacyName}</h3>
                  <p className="text-[11px] text-blue-100">{activeOffer.distance} • {activeOffer.address}</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded-md backdrop-blur-xs">
                {t.inStockBadge}
              </span>
            </div>
          </div>

          {/* Large Pickup Code Area */}
          <div className="p-5 text-center space-y-2 bg-gradient-to-b from-white to-slate-50/50">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {t.verificationCodeTitle}
            </span>

            {/* Pickup Code Display */}
            <div className="flex items-center justify-center gap-3">
              <div className="text-4xl font-black tracking-widest text-slate-900 bg-slate-100/90 px-6 py-2.5 rounded-2xl border border-slate-200 shadow-inner font-mono">
                #{pickupCode}
              </div>

              <button
                onClick={handleCopyCode}
                title="Copy Pickup Code"
                className="w-11 h-11 rounded-2xl bg-blue-50 hover:bg-blue-100 text-brand-600 border border-blue-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Calm Expiration Time Notice */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/70">
                <span>{t.savedUntil(savedUntilTimeStr)}</span>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="relative flex items-center justify-between px-4 py-1 bg-white">
            <div className="w-4 h-4 rounded-full bg-slate-100 -ml-6 border border-slate-200"></div>
            <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2"></div>
            <div className="w-4 h-4 rounded-full bg-slate-100 -mr-6 border border-slate-200"></div>
          </div>

          {/* Reserved Item Summary */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="flex justify-between items-start text-xs">
              <div>
                <div className="font-bold text-slate-900">{activeOffer.medicineName}</div>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                  activeOffer.isGeneric ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {activeOffer.isGeneric ? t.similarMedicineTitle : t.prescribedBrand}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold">{t.payAtStore}</span>
                <div className="text-base font-extrabold text-slate-900">₹{activeOffer.price.toFixed(2)}</div>
              </div>
            </div>

            {/* Mandatory Safety / Prescription Reminder */}
            <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <FileText className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>{t.prescriptionNotice}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-2">
        <button
          onClick={() => setIsDirectionsOpen(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>{t.directionsBtn}</span>
        </button>

        <button
          onClick={() => cancelHold()}
          className="w-full py-2.5 text-center text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          {t.cancelHoldBtn}
        </button>
      </div>
    </div>
  );
};
