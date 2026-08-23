import React from 'react';
import {
  Store,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Pill,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const MatchScreen: React.FC = () => {
  const { activeOffer, handleHoldItemClick, startStoreCheck, t } = useSimulator();

  if (!activeOffer) return null;

  return (
    <div className="flex-1 p-4 flex flex-col justify-between animate-slide-up">
      <div className="space-y-4">

        {/* Live Match Alert Banner */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce-subtle" />
            <span>{t.storeConfirmedStock}</span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {t.storeMatchFound}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.readyAtCounter}
          </p>
        </div>

        {/* Verified Pharmacy & Medicine Offer Card */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-4 border-2 border-brand-500/30 shadow-xl shadow-blue-500/10 space-y-4">
          
          {/* Pharmacy Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{activeOffer.pharmacyName}</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    {t.inStockBadge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                  <span className="flex items-center gap-0.5 text-brand-600 font-semibold">
                    <MapPin className="w-3 h-3" />
                    {activeOffer.distance}
                  </span>
                  <span>•</span>
                  <span>Verified Pharmacist</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quoted Medicine Formulation Details */}
          <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5">
            
            {/* Formulation Badge */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                activeOffer.isGeneric
                  ? 'bg-teal-600 text-white'
                  : 'bg-brand-600 text-white'
              }`}>
                <Pill className="w-3 h-3" />
                {activeOffer.isGeneric ? t.similarMedicineTitle : t.prescribedBrand}
              </span>

              {activeOffer.isGeneric && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {t.savePercent(activeOffer.savingsPercent)}
                </span>
              )}
            </div>

            {/* Medicine name & Price */}
            <div className="flex justify-between items-center pt-1">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {activeOffer.medicineName}
                </h4>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="text-[10px] text-slate-400 font-semibold block">{t.quotedPriceLabel}</span>
                <div className="text-lg font-black text-slate-900">
                  ₹{activeOffer.price.toFixed(2)}
                </div>
                {activeOffer.isGeneric && (
                  <div className="text-[10px] text-slate-400 line-through">
                    ₹{activeOffer.originalBrandPrice.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Bio-Equivalence & Safety Assurance Box */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {t.cdscoApproved}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                {t.counterHoldDuration}
              </span>
            </div>
          </div>

          {/* Reassurance Message */}
          <div className="text-[11px] text-slate-500 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex items-start gap-2">
            <ThumbsUp className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <span>
              {t.reassuranceNote}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button: "Hold Item for Me" */}
      <div className="pt-4 space-y-2">
        <button
          onClick={handleHoldItemClick}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all group"
        >
          <span>{t.holdItemBtn}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={startStoreCheck}
          className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          {t.checkOtherStores}
        </button>
      </div>
    </div>
  );
};
