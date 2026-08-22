import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Phone,
  AlertCircle,
  KeyRound,
  PackageCheck
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const HoldsQueue: React.FC = () => {
  const {
    reservations,
    verificationFeedback,
    verifyAndHandover,
    clearVerificationFeedback
  } = useSimulator();

  const [inputToken, setInputToken] = useState<string>('');

  const activeHolds = reservations.filter(r => r.status === 'HELD');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyAndHandover(inputToken);
    if (result.success) {
      setInputToken('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(e.target.value);
    if (verificationFeedback) {
      clearVerificationFeedback();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-lg p-5 space-y-4">
      {/* Queue Header & Verification Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            Active Counter Holds & Pickups
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-brand-800">
              {activeHolds.length} Waiting Pickup
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Type patient's 4-digit token pass to verify physical prescription
          </p>
        </div>

        {/* Verification Form Box - Strict PIN Entry Only */}
        <form onSubmit={handleVerify} className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">#</span>
            <input
              type="text"
              value={inputToken}
              onChange={handleInputChange}
              placeholder="e.g. 4829"
              maxLength={6}
              className="w-28 pl-7 pr-2 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-brand-500 focus:bg-white focus:outline-none uppercase tracking-widest text-slate-900 shadow-2xs"
            />
          </div>

          <button
            type="submit"
            className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Verify & Complete Handover</span>
          </button>
        </form>
      </div>

      {/* Conditional Feedback Banner: ONLY shown after manual submission */}
      {verificationFeedback && (
        <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 animate-slide-up ${
          verificationFeedback.success
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
            : 'bg-rose-50 text-rose-900 border border-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {verificationFeedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{verificationFeedback.message}</span>
          </div>

          <button
            onClick={clearVerificationFeedback}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-700 px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Reservations Multi-Hold Queue List */}
      <div className="space-y-2.5">
        {reservations.length === 0 ? (
          <div className="text-center py-7 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
            <div className="w-9 h-9 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-700">No Active Counter Holds</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Customer reservations placed via mobile will appear in this queue.
            </p>
          </div>
        ) : (
          reservations.map((item) => (
            <div
              key={item.id || item.token}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                item.status === 'VERIFIED_HANDED_OVER'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 opacity-90'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono font-black text-xs shrink-0 ${
                  item.status === 'VERIFIED_HANDED_OVER'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-white'
                }`}>
                  <span className="text-[9px] font-normal leading-none opacity-80">TOKEN</span>
                  <span>#{item.token}</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-black text-slate-900">{item.medicineName}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isGeneric ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.isGeneric ? 'Generic Substitute' : 'Exact Brand'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">₹{item.price.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {item.customerPhoneMasked}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Clock className="w-3 h-3" />
                      Saved until {item.savedUntil} (30 mins)
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge - Strict Verification Indicator (No 1-click bypass) */}
              <div className="flex items-center gap-2 justify-end">
                {item.status === 'VERIFIED_HANDED_OVER' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Handed Over & Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Waiting for PIN Verification
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
