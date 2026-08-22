import React, { useRef } from 'react';
import {
  Store,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Upload,
  FileSpreadsheet,
  Zap,
  PanelRightClose
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { PRIMARY_STORE } from '../../data/medicines';
import { InquiryAlertCard } from './InquiryAlertCard';
import { HoldsQueue } from './HoldsQueue';
import { InventoryDrawer } from './InventoryDrawer';

export const PharmacistTerminal: React.FC = () => {
  const {
    status,
    isMuted,
    toggleMute,
    resetSimulator,
    activeOffer,
    toggleTerminalCollapse,
    uploadedInventory,
    handleFileUpload,
    loadSampleInventory,
    setIsInventoryDrawerOpen
  } = useSimulator();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 max-w-2xl w-full">
      {/* Pharmacist Terminal Main Frame */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 border border-slate-200/90 shadow-2xl shadow-blue-900/10 space-y-5">
        
        {/* Terminal Header & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
              <Store className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  {PRIMARY_STORE.name}
                </h2>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  ({PRIMARY_STORE.branchNumber})
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>POS Terminal Counter #1</span>
              </p>
            </div>
          </div>

          {/* Quick Terminal Utilities & Collapse Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio Alert Chime' : 'Mute Audio Alert Chime'}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-blue-50 text-brand-700 border-blue-200 hover:bg-blue-100'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-600" />}
              <span className="hidden md:inline">{isMuted ? 'Muted' : 'Chime On'}</span>
            </button>

            <button
              onClick={resetSimulator}
              title="Reset Demo Simulator"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Collapse Panel Button */}
            <button
              onClick={toggleTerminalCollapse}
              title="Collapse Pharmacist Panel into Sidebar Pill"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <PanelRightClose className="w-4 h-4" />
              <span className="hidden lg:inline">Collapse</span>
            </button>
          </div>
        </div>

        {/* Section: Offline Excel / CSV Inventory Import Toolbar */}
        <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".xlsx,.csv,.xls"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-1.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-brand-600" />
              <span>Upload Inventory (.xlsx / .csv)</span>
            </button>

            <button
              onClick={loadSampleInventory}
              className="py-1.5 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>Load Sample Stock</span>
            </button>
          </div>

          {/* Uploaded Inventory Badge */}
          {uploadedInventory && (
            <button
              onClick={() => setIsInventoryDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
              title="Click to view full inventory spreadsheet table"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-[200px]">✓ {uploadedInventory.fileName}</span>
              <span className="bg-emerald-200/80 px-1.5 py-0.2 rounded text-[10px]">
                {uploadedInventory.rowCount} SKUs
              </span>
            </button>
          )}
        </div>

        {/* Section 1: Dynamic Inquiry / Verification Queue */}
        <div className="space-y-4">
          
          {/* Incoming Inquiry Card (Appears during Radar mode) */}
          <InquiryAlertCard />

          {/* Status when offer claimed but waiting for hold */}
          {status === 'STORE_FOUND' && activeOffer && (
            <div className="bg-emerald-50/70 rounded-3xl p-5 border border-emerald-200 flex items-center justify-between gap-4 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    Offer Transmitted to Patient
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Offered {activeOffer.medicineName} for ₹{activeOffer.price.toFixed(2)}. Waiting for customer to confirm counter reservation on phone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Active Counter Holds Queue */}
          <HoldsQueue />
        </div>
      </div>

      {/* Terminal Viewport Footer Subtitle */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 shadow-sm">
          <Store className="w-3.5 h-3.5 text-slate-600" />
          Pharmacist Counter POS Terminal Panel
        </span>
      </div>

      {/* Full Spreadsheet Drawer Modal */}
      <InventoryDrawer />
    </div>
  );
};
