import React from 'react';
import {
  Activity,
  Radio,
  CheckCircle2,
  Clock,
  MapPin,
  XCircle,
  Zap
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import type { ActivityLogItem } from '../../types';

export const TerminalActivityLog: React.FC = () => {
  const { activityLogs } = useSimulator();

  const getLogIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'SEARCH_INIT':
        return <Radio className="w-3.5 h-3.5 text-brand-600 animate-pulse" />;
      case 'OFFER_CLAIM':
        return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'HOLD_PLACED':
        return <Clock className="w-3.5 h-3.5 text-blue-600" />;
      case 'HANDOVER_COMPLETE':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'OUT_OF_STOCK':
        return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
      case 'RADIUS_EXPANDED':
        return <MapPin className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-md p-5 space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Network Reverse-Demand Telemetry Log
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Stream
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {activityLogs.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400">
            Waiting for patient search inquiries...
          </div>
        ) : (
          activityLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 transition-colors flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 p-1 rounded-lg bg-white shadow-2xs border border-slate-200/60">
                  {getLogIcon(log.type)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">{log.title}</span>
                    {log.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {log.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {log.description}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {log.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
