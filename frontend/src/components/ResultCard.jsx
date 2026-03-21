import React from 'react';
import { Pill, Calendar, Hash, Tag, CheckCircle2, AlertCircle, AlertTriangle, ScanLine, FileBarChart, Zap } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    success: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/60', label: 'Success' },
    partial: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/60', label: 'Partial' },
    failed: { icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200/60', label: 'Failed' },
  };
  
  const config = configs[status] || configs.failed;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 ${config.bg} ${config.text} border ${config.border} rounded-full text-xs font-bold uppercase tracking-widest shadow-sm`}>
      <Icon size={14} strokeWidth={2.5}/>
      {config.label}
    </div>
  );
};

const ValueDisplay = ({ value, label }) => (
  <span className={value ? "text-slate-900 font-bold" : "text-slate-400 font-medium italic"}>
    {value || "Not detected"}
  </span>
);

const ResultCard = ({ result, isWaiting }) => {
  // ─── Premium Empty State ───
  if (!result && !isWaiting) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full ring-1 ring-slate-100">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Extraction Result</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
          
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.3]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/5 border border-slate-100 mb-6 group">
               <div className="absolute inset-0 bg-blue-50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500 ease-out origin-center"></div>
               <ScanLine size={48} className="text-blue-500 relative z-10" strokeWidth={1.5} />
               <div className="absolute top-0 w-full h-1 bg-blue-500 rounded-t-2xl animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Ready to Extract</h3>
            <p className="text-base text-slate-500 mb-8 max-w-sm">Upload a medicine image to see extracted fields here</p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 shadow-sm"><Pill size={14} className="text-blue-500"/> Name</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 shadow-sm"><Calendar size={14} className="text-indigo-500"/> Expiry</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 shadow-sm"><Hash size={14} className="text-amber-500"/> Batch</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 shadow-sm"><Tag size={14} className="text-emerald-500"/> Price</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ─── Loading State ───
  if (isWaiting) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full relative ring-1 ring-slate-100">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-20 flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-100 flex flex-col items-center gap-4 min-w-[240px]">
            <div className="relative flex items-center justify-center h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <Zap size={16} className="text-blue-600 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-1">Analyzing</h3>
              <p className="text-xs font-semibold text-slate-400">Powered by Gemini AI</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Extraction Result</h2>
        </div>
        <div className="p-8 space-y-6 flex-1 opacity-20 filter blur-[2px]">
           {/* Skeleton Loaders */}
           <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
           <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-24 bg-slate-200 rounded-xl animate-pulse col-span-2"></div>
           </div>
        </div>
      </div>
    );
  }

  // ─── Result State ───
  // Safety check handling structure differences between raw response and DB record
  const data = result.data || result; 
  const status = data.extraction_status || result.status || result.extraction_status || 'failed';

  return (
    <div className="bg-white rounded-2xl shadow-md shadow-blue-900/5 border border-slate-200 overflow-hidden flex flex-col h-full ring-2 ring-blue-500/10 relative">
      
      {/* Top Banner */}
      <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
           <FileBarChart size={20} className="text-slate-400" />
           <h2 className="text-xl font-bold text-slate-900 tracking-tight">Extraction Result</h2>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="p-6 md:p-8 space-y-5 flex-1 bg-slate-50/30 overflow-y-auto">
        
        {/* Medicine Name (Primary Field) */}
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200/50 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="bg-white text-blue-600 p-3 rounded-xl shrink-0 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform">
            <Pill size={24} strokeWidth={2.5}/>
          </div>
          <div className="relative z-10 w-full">
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1.5 opacity-80">Medicine Name</p>
            <h3 className="text-xl leading-tight"><ValueDisplay value={data.medicine_name} /></h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Expiry Date */}
          <div className="flex flex-col gap-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group">
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
              <Calendar size={18} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform" />
              <p className="text-[11px] font-black uppercase tracking-widest opacity-80">Expiry Date</p>
            </div>
            <p className="text-lg"><ValueDisplay value={data.expiry_date} /></p>
          </div>

          {/* Batch Number */}
          <div className="flex flex-col gap-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all group">
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              <Hash size={18} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform" />
              <p className="text-[11px] font-black uppercase tracking-widest opacity-80">Batch Number</p>
            </div>
            <p className="text-lg truncate" title={data.batch_number}><ValueDisplay value={data.batch_number} /></p>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm sm:col-span-2 hover:shadow-md hover:border-emerald-300 transition-all relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-2 text-emerald-600 mb-2 relative z-10">
              <Tag size={18} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform" />
              <p className="text-[11px] font-black uppercase tracking-widest opacity-80">MRP Price</p>
            </div>
            <div className="relative z-10">
              {data.price ? (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200/60 shadow-sm">
                  <span className="text-emerald-500 font-bold text-xl">₹</span>
                  <span className="text-emerald-700 font-black text-3xl tracking-tight leading-none">{data.price}</span>
                </div>
              ) : (
                <p className="text-lg"><ValueDisplay value={null} /></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
