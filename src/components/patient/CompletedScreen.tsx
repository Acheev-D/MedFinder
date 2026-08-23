import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  Receipt,
  ArrowRight,
  TrendingDown,
  Heart
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const CompletedScreen: React.FC = () => {
  const { activeOffer, resetSimulator, pickupCode, t } = useSimulator();

  return (
    <div className="flex-1 p-4 flex flex-col justify-between animate-slide-up">
      <div className="space-y-4 text-center pt-3">
        
        {/* Celebration Icon */}
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-spin" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            {t.completedTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Token #{pickupCode} verified and dispensed at counter.
          </p>
        </div>

        {/* Receipt Card */}
        {activeOffer && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-brand-600" />
                {t.customerReceipt}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">PAID & PICKED UP</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Medicine:</span>
                <span className="font-bold text-slate-900">{activeOffer.medicineName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.verifiedPharmacy}:</span>
                <span className="font-medium text-slate-800">{activeOffer.pharmacyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.payAtStore}:</span>
                <span className="font-extrabold text-slate-900">₹{activeOffer.price.toFixed(2)}</span>
              </div>
              {activeOffer.isGeneric && (
                <div className="flex justify-between pt-1 border-t border-slate-100 text-emerald-700 font-bold">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {t.savePercent(activeOffer.savingsPercent)}
                  </span>
                  <span>₹{activeOffer.savingsAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{t.prescriptionNotice}</span>
              <span>100% Genuine CDSCO Batch</span>
            </div>
          </div>
        )}

        {/* Patient Review Tip */}
        <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100 text-[11px] text-slate-600 flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
          <span>{t.completedSubtitle}</span>
        </div>
      </div>

      {/* Start New Search Action */}
      <div className="pt-4">
        <button
          onClick={resetSimulator}
          className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{t.newSearchBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
