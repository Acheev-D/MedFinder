import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Search,
  Upload,
  Layers,
  MapPin,
  CheckCircle2,
  Trash2,
  Zap,
  Package
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const InventoryDrawer: React.FC = () => {
  const {
    uploadedInventory,
    isInventoryDrawerOpen,
    setIsInventoryDrawerOpen,
    handleFileUpload,
    loadSampleInventory,
    removeUploadedInventory
  } = useSimulator();

  const [searchFilter, setSearchFilter] = useState('');

  if (!isInventoryDrawerOpen) return null;

  const fileInputRef = React.createRef<HTMLInputElement>();

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const items = uploadedInventory?.items || [];
  const filteredItems = items.filter(item =>
    item.medicineName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.saltComposition.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.shelfLocation.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  Local Pharmacy Stock Database
                </h2>
                {uploadedInventory && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live Indexed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {uploadedInventory
                  ? `${uploadedInventory.fileName} • ${uploadedInventory.rowCount} SKUs Loaded`
                  : 'No offline stock file loaded.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInventoryDrawerOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by medicine, formula, shelf..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:border-brand-500 focus:outline-none text-slate-800"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".xlsx,.csv,.xls"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-brand-600" />
              <span>Upload CSV / Excel</span>
            </button>

            <button
              onClick={loadSampleInventory}
              className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Load Sample</span>
            </button>

            {uploadedInventory && (
              <button
                onClick={removeUploadedInventory}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                title="Clear uploaded stock"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Inventory Table Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.length > 0 ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3.5">Medicine Name</th>
                    <th className="py-3 px-3.5 hidden sm:table-cell">Salt Formula</th>
                    <th className="py-3 px-3">Stock Qty</th>
                    <th className="py-3 px-3">Unit MRP</th>
                    <th className="py-3 px-3.5">Shelf Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          {item.medicineName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono sm:hidden">
                          {item.saltComposition}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 hidden sm:table-cell text-slate-600 max-w-xs truncate">
                        {item.saltComposition}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.stockQty > 20
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.stockQty > 5
                            ? 'bg-blue-100 text-brand-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {item.stockQty} boxes
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        ₹{item.unitMrp.toFixed(2)}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                          <MapPin className="w-3 h-3 text-brand-600" />
                          {item.shelfLocation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 space-y-2">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No matching medicine found</h4>
              <p className="text-xs text-slate-400">
                Try searching a different drug name or upload a spreadsheet.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Total Catalog:</span>
            <span>{items.length} items loaded</span>
          </div>
          <button
            onClick={() => setIsInventoryDrawerOpen(false)}
            className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
