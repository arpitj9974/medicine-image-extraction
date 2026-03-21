import React from 'react';
import { Pill, Calendar, Hash, Tag, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    success: { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Success' },
    partial: { icon: AlertTriangle, bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', label: 'Partial' },
    failed: { icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Failed' },
  };
  
  const config = configs[status] || configs.failed;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 ${config.bg} ${config.text} border ${config.border} rounded-full text-xs font-semibold uppercase tracking-wider`}>
      <Icon size={14} />
      {config.label}
    </div>
  );
};

const ValueDisplay = ({ value, label }) => (
  <span className={value ? "text-slate-900 font-semibold" : "text-slate-400 font-normal italic"}>
    {value || "Not detected"}
  </span>
);

const ResultCard = ({ result, isWaiting }) => {
  // Empty State
  if (!result && !isWaiting) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full opacity-60">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Extraction Result</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Pill size={32} className="text-slate-300" />
          </div>
          <p>Awaiting upload...</p>
          <p className="text-sm mt-1">Extracted data will appear here.</p>
        </div>
      </div>
    );
  }

  // Loading State
  if (isWaiting) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full relative">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-primary-100 flex items-center gap-3">
            <div className="relative flex items-center justify-center h-8 w-8">
              <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
              <div className="absolute inset-0 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="text-sm font-medium text-slate-700">AI is analyzing text...</span>
          </div>
        </div>
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Extraction Result</h2>
        </div>
        <div className="p-6 space-y-5 flex-1 opacity-20 filter blur-sm">
          {/* Skeleton Loaders */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
             <div className="bg-slate-200 w-10 h-10 rounded-lg animate-pulse" />
             <div className="space-y-2 flex-1"><div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"/><div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse"/></div>
          </div>
        </div>
      </div>
    );
  }

  // Result State
  // Safety check handling structure differences between raw response and DB record
  const data = result.data || result; 
  const status = data.extraction_status || result.status || result.extraction_status || 'failed';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full ring-1 ring-primary-500/10">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Extraction Result</h2>
        <StatusBadge status={status} />
      </div>

      <div className="p-6 space-y-4 flex-1 bg-gradient-to-b from-white to-slate-50/50">
        
        {/* Medicine Name (Primary Field) */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100/50 shadow-sm shadow-blue-900/5">
          <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg shrink-0">
            <Pill size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Medicine Name</p>
            <p className="text-lg"><ValueDisplay value={data.medicine_name} /></p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Calendar size={16} />
              <p className="text-xs font-semibold uppercase tracking-wider">Expiry Date</p>
            </div>
            <p className="text-base"><ValueDisplay value={data.expiry_date} /></p>
          </div>

          {/* Batch Number */}
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Hash size={16} />
              <p className="text-xs font-semibold uppercase tracking-wider">Batch Number</p>
            </div>
            <p className="text-base truncate" title={data.batch_number}><ValueDisplay value={data.batch_number} /></p>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-white border border-slate-200 shadow-sm sm:col-span-2 hover:border-slate-300 transition-colors relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Tag size={16} className={data.price ? "text-emerald-500" : ""} />
              <p className="text-xs font-semibold uppercase tracking-wider">MRP Price</p>
            </div>
            <p className="text-lg">
              {data.price ? (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  ₹{data.price}
                </span>
              ) : (
                <ValueDisplay value={null} />
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
