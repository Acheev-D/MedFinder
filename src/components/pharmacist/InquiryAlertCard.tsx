import React, { useState } from 'react';
import {
  BellRing,
  MapPin,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Zap,
  Lock,
  Sparkles,
  IndianRupee,
  PackageCheck,
  FileImage,
  X,
  Eye,
  ZoomIn
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import type { IncomingInquiry } from '../../types';

export const InquiryAlertCard: React.FC = () => {
  const {
    incomingInquiries,
    respondToInquiry,
    timerSeconds,
    findInventoryMatch,
    setIsInventoryDrawerOpen,
    t
  } = useSimulator();

  // Local state for optional price inputs per inquiry ID
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});

  // Lightbox modal state for viewing prescription image full size
  const [viewingRxImage, setViewingRxImage] = useState<string | null>(null);

  const activeInquiries = incomingInquiries.filter(i => i.status === 'PENDING');

  if (activeInquiries.length === 0) {
    return null;
  }

  const handlePriceChange = (inquiryId: string, val: string) => {
    const clean = val.replace(/[^0-9.]/g, '');
    setCustomPrices(prev => ({ ...prev, [inquiryId]: clean }));
  };

  const getCustomPriceNumber = (inquiryId: string): number | undefined => {
    const val = customPrices[inquiryId];
    if (val && !isNaN(Number(val)) && Number(val) > 0) {
      return Number(val);
    }
    return undefined;
  };

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Full-Size Prescription Image Lightbox Modal */}
      {viewingRxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-in">
            {/* Lightbox Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-brand-600">
                  <FileImage className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.viewRx}
                  </h3>
                  <p className="text-[11px] text-slate-500">Live patient camera upload</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingRxImage(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Image Stage */}
            <div className="p-4 bg-slate-900/5 max-h-[70vh] overflow-auto flex items-center justify-center">
              <img
                src={viewingRxImage}
                alt="Patient Prescription Full View"
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-lg border border-slate-200"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setViewingRxImage(null)}
                className="py-2 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {activeInquiries.map((inquiry: IncomingInquiry) => {
        const med = inquiry.medicine;
        const generic = med.genericEquivalent;
        const allowsGeneric = inquiry.allowAlternatives;
        const customPriceVal = customPrices[inquiry.id] || '';
        const customPriceNum = getCustomPriceNumber(inquiry.id);

        // Check if item or generic is in uploaded Excel inventory
        const brandInventoryMatch = findInventoryMatch(med.brandName, med.activeFormula);
        const genericInventoryMatch = findInventoryMatch(generic.name, med.activeFormula);
        const primaryMatch = brandInventoryMatch || genericInventoryMatch;

        const exactBrandPriceDisplay = customPriceNum
          ? customPriceNum.toFixed(0)
          : brandInventoryMatch
          ? brandInventoryMatch.unitMrp.toFixed(0)
          : med.brandPrice.toFixed(0);

        const genericPriceDisplay = customPriceNum
          ? customPriceNum.toFixed(0)
          : genericInventoryMatch
          ? genericInventoryMatch.unitMrp.toFixed(0)
          : generic.price.toFixed(0);

        return (
          <div
            key={inquiry.id}
            className="relative overflow-hidden bg-white/95 backdrop-blur-md rounded-3xl border-2 border-brand-500 shadow-2xl shadow-blue-600/15 p-5 space-y-4"
          >
            {/* Top Banner Alert Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                  <BellRing className="w-5 h-5 animate-bounce-subtle" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black tracking-wider uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      🚨 Incoming Customer Inquiry
                    </span>
                    
                    {/* Dynamic Generic Acceptance Badge */}
                    {allowsGeneric ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        💡 Generic Equivalent Accepted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                        <Lock className="w-3 h-3 text-slate-500" />
                        🔒 Exact Brand Requested Only
                      </span>
                    )}

                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-600" />
                      {inquiry.customerLocation}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Auto-expires in <span className="font-bold text-brand-600 font-mono">{timerSeconds}s</span>
                  </p>
                </div>
              </div>

              {/* Live Timer badge */}
              <div className="text-right">
                <div className="text-sm font-black font-mono text-brand-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                  {timerSeconds}s
                </div>
              </div>
            </div>

            {/* Attached Prescription Photo Card (If Patient attached an actual camera image) */}
            {inquiry.prescriptionImage && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="relative group cursor-pointer" onClick={() => setViewingRxImage(inquiry.prescriptionImage!)}>
                    <img
                      src={inquiry.prescriptionImage}
                      alt="Prescription Thumbnail"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-brand-500 shadow-sm transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <FileImage className="w-3.5 h-3.5 text-brand-600" />
                        Attached Doctor Prescription Photo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Uploaded by patient directly from camera
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingRxImage(inquiry.prescriptionImage!)}
                  className="py-1.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.viewRx}</span>
                </button>
              </div>
            )}

            {/* Smart Match Flag on Uploaded Offline Inventory */}
            {primaryMatch && (
              <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs text-emerald-900 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <PackageCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold leading-tight">
                    <strong className="text-emerald-800 font-black">⚡ In Uploaded Stock</strong>: {primaryMatch.medicineName} ({primaryMatch.stockQty} boxes in store • <span className="underline decoration-emerald-500 font-mono">{primaryMatch.shelfLocation}</span>)
                  </span>
                </div>
                <button
                  onClick={() => setIsInventoryDrawerOpen(true)}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-white/80 hover:bg-white px-2 py-1 rounded-lg border border-emerald-300 shrink-0 transition-colors cursor-pointer"
                >
                  View Table
                </button>
              </div>
            )}

            {/* Requested Medicine Details & Generic Subtitle */}
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Prescribed Medicine Requested:
                    </span>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      {med.brandName}
                      <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {med.dosageForm}
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Subtitle Callout */}
                {allowsGeneric ? (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex items-center gap-2 text-xs text-teal-800 bg-teal-50/70 p-2.5 rounded-xl border border-teal-200/60">
                    <Zap className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="leading-tight">
                      Customer accepts <strong>{generic.name}</strong> or <strong>{med.brandName}</strong>.
                    </span>
                  </div>
                ) : (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="leading-tight font-medium">
                      Customer requested exact brand only. No generic substitutes allowed.
                    </span>
                  </div>
                )}
              </div>

              {/* Optional Price Quotation Input Field */}
              <div className="bg-blue-50/40 rounded-2xl p-3 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <label htmlFor={`price-input-${inquiry.id}`} className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-brand-600" />
                    Counter Price Quote (Optional):
                  </label>
                  <p className="text-[10px] text-slate-500">
                    Leave blank to use standard catalog benchmark price.
                  </p>
                </div>

                <div className="relative w-full sm:w-44">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">₹</span>
                  <input
                    id={`price-input-${inquiry.id}`}
                    type="text"
                    value={customPriceVal}
                    onChange={(e) => handlePriceChange(inquiry.id, e.target.value)}
                    placeholder={brandInventoryMatch ? `${brandInventoryMatch.unitMrp.toFixed(0)}` : `${med.brandPrice.toFixed(0)}`}
                    className="w-full pl-7 pr-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:border-brand-500 focus:outline-none text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Tap to Claim Request:
                </div>

                {allowsGeneric ? (
                  /* Scenario B: 3 Buttons Active */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {/* Action 1: Have Exact Brand */}
                    <button
                      onClick={() => respondToInquiry(inquiry.id, 'EXACT', customPriceNum)}
                      className="py-3 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-left">
                        <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="leading-tight">Have Exact Brand</div>
                          <div className="text-[10px] text-emerald-100 font-normal">₹{exactBrandPriceDisplay} quoted</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded font-mono">Claim</span>
                    </button>

                    {/* Action 2: Have Same Formula (Generic) */}
                    <button
                      onClick={() => respondToInquiry(inquiry.id, 'GENERIC', customPriceNum)}
                      className="py-3 px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-left">
                        <RefreshCw className="w-4 h-4 group-hover:rotate-45 transition-transform shrink-0 text-indigo-200" />
                        <div>
                          <div className="leading-tight">Have Same Formula</div>
                          <div className="text-[10px] text-indigo-200 font-normal">₹{genericPriceDisplay} quoted</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-indigo-700/80 px-1.5 py-0.5 rounded font-mono">Claim</span>
                    </button>

                    {/* Action 3: Out of Stock */}
                    <button
                      onClick={() => respondToInquiry(inquiry.id, 'OUT_OF_STOCK')}
                      className="py-3 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Out of Stock</span>
                    </button>
                  </div>
                ) : (
                  /* Scenario A: 2 Buttons Only (Generic button hidden) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Action 1: Have Exact Brand */}
                    <button
                      onClick={() => respondToInquiry(inquiry.id, 'EXACT', customPriceNum)}
                      className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-left">
                        <CheckCircle2 className="w-4.5 h-4.5 group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="leading-tight text-sm font-black">Have Exact Brand</div>
                          <div className="text-[11px] text-emerald-100 font-normal">₹{exactBrandPriceDisplay} quoted</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded font-mono">Claim</span>
                    </button>

                    {/* Action 2: Out of Stock */}
                    <button
                      onClick={() => respondToInquiry(inquiry.id, 'OUT_OF_STOCK')}
                      className="py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <XCircle className="w-4.5 h-4.5 text-rose-600" />
                      <span className="text-sm">Out of Stock</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
