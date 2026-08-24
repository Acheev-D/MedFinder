import React, { useState, useRef } from 'react';
import {
  Search,
  Pill,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Camera,
  FileText,
  X
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { MEDICINE_CATALOG } from '../../data/medicines';
import type { Medicine } from '../../types';

export const SearchScreen: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedMedicine,
    selectMedicine,
    allowAlternatives,
    setAllowAlternatives,
    startStoreCheck,
    prescriptionImage,
    setPrescriptionImage,
    clearPrescriptionImage,
    t
  } = useSimulator();

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle camera photo capture or image file selection
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (result) {
          setPrescriptionImage(result);
          if (!searchQuery.trim()) {
            setSearchQuery('Prescription Upload');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter autocomplete suggestions based on query
  const suggestions = MEDICINE_CATALOG.filter(med =>
    med.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.genericEquivalent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.activeFormula.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMed = (med: Medicine) => {
    selectMedicine(med);
    setIsFocused(false);
  };

  return (
    <div className="flex-1 p-4 flex flex-col justify-between animate-fade-in">
      <div className="space-y-3.5">
        
        {/* Hidden Camera / File Input */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleImageCapture}
          className="hidden"
        />

        {/* Intro Greeting Banner */}
        <div className="pt-1.5">
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {t.tagline}
          </h1>
        </div>

        {/* Search Bar with Camera Action Button */}
        <div className="relative">
          <div className={`relative flex items-center bg-white rounded-full border transition-all duration-200 shadow-sm ${
            isFocused ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
          }`}>
            <div className="pl-4 pr-2 text-slate-400">
              <Search className="w-4 h-4 text-brand-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={t.searchPlaceholder}
              className="w-full py-3.5 pr-2 text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent outline-none rounded-full"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mr-1 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                ×
              </button>
            )}

            {/* Camera Upload Action Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title={t.attachPrescription}
              className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 active:scale-95 transition-all border border-blue-200 bg-white shadow-2xs mr-2 cursor-pointer shrink-0"
            >
              <Camera className="w-4 h-4 text-brand-600" />
            </button>
          </div>

          {/* Autocomplete Suggestions Dropdown (No upfront hardcoded prices) */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-xl z-30 overflow-hidden animate-slide-up">
              <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 border-b border-slate-100 bg-slate-50/70">
                {t.matchingPrescriptions(suggestions.length)}
              </div>
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => handleSelectMed(med)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100/60 flex items-center justify-center text-brand-600">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{med.brandName}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {med.dosageForm}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prescription Attachment Badge / Preview Chip */}
        {prescriptionImage && (
          <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200/90 rounded-2xl p-2 px-3 animate-slide-up shadow-2xs">
            <div className="flex items-center gap-2.5">
              <img
                src={prescriptionImage}
                alt="Prescription Thumbnail"
                className="w-10 h-10 rounded-xl object-cover border border-blue-300 shadow-xs"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  <span>{t.rxAttached}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Ready for pharmacy dispatch</span>
              </div>
            </div>

            <button
              type="button"
              onClick={clearPrescriptionImage}
              title={t.removeRx}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Selected Medicine Info Card & "Similar Medicine" Card */}
        {selectedMedicine && (
          <div className="space-y-3">
            {/* Prescribed Medicine Base Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900">{selectedMedicine.brandName}</h2>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                        {selectedMedicine.dosageForm}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  <ShieldCheck className="w-3 h-3 text-brand-600" />
                  {t.prescribedBrand}
                </span>
              </div>
            </div>

            {/* Similar Medicine Recommendation Card */}
            <div className={`relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 ${
              allowAlternatives
                ? 'bg-gradient-to-br from-teal-500/[0.12] via-emerald-500/[0.08] to-indigo-500/[0.1] border-teal-400/60 shadow-md ring-1 ring-teal-500/20'
                : 'bg-slate-50/90 border-slate-200/90 shadow-sm'
            }`}>
              
              {/* Dynamic Status Pill Badge: "Similar Medicine" */}
              <div className="flex items-center justify-between mb-3">
                {allowAlternatives ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-600 text-white shadow-xs animate-slide-up">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.searchingBoth(selectedMedicine.brandName, selectedMedicine.genericEquivalent.name)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700">
                    <Lock className="w-3 h-3 text-slate-500" />
                    {t.similarMedicineTitle}
                  </span>
                )}

                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-teal-600" />
                  {t.similarMedicineTitle}
                </span>
              </div>

              {/* Title & Clinical Equivalence Description */}
              <div className="space-y-1 pb-3">
                <h3 className="text-sm font-black text-slate-900">
                  {selectedMedicine.genericEquivalent.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {t.similarMedicineDesc}
                </p>
              </div>

              {/* Alternative Formulation Toggle Switch */}
              <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-200/70">
                <label htmlFor="generic-toggle" className="text-xs font-bold text-slate-900 cursor-pointer block leading-tight">
                  {t.toggleSimilarMedicine}
                </label>

                {/* iOS-Style Switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="generic-toggle"
                    type="checkbox"
                    checked={allowAlternatives}
                    onChange={(e) => setAllowAlternatives(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600 shadow-inner transition-colors"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button: "Find Stores" */}
      <div className="pt-4">
        <button
          onClick={startStoreCheck}
          className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all group cursor-pointer"
        >
          <span>{t.findStoresBtn}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
