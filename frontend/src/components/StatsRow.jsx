import React from 'react';
import { Database, UploadCloud, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass, bgClass, labelClass }) => (
  <div className={`bg-white rounded-2xl p-5 border ${borderClass} shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow relative overflow-hidden group`}>
    <div className={`absolute -right-4 -top-4 w-24 h-24 ${bgClass} rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 ease-out`} />
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm relative z-10 ${bgClass} ${colorClass}`}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col relative z-10">
      <span className={`text-sm font-semibold tracking-wider uppercase mb-1 ${labelClass}`}>{title}</span>
      <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">{value}</span>
    </div>
  </div>
);

const StatsRow = ({ totalRecords = 0, todayUploads = 0, successRate = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
      <StatCard 
        title="Total Records" 
        value={totalRecords} 
        icon={Database} 
        colorClass="text-blue-600"
        borderClass="border-slate-200"
        bgClass="bg-blue-50"
        labelClass="text-slate-500"
      />
      <StatCard 
        title="Today's Uploads" 
        value={todayUploads} 
        icon={UploadCloud} 
        colorClass="text-indigo-600"
        borderClass="border-slate-200"
        bgClass="bg-indigo-50"
        labelClass="text-slate-500"
      />
      <StatCard 
        title="Success Rate" 
        value={`${successRate}%`} 
        icon={CheckCircle2} 
        colorClass="text-emerald-600"
        borderClass="border-emerald-100"
        bgClass="bg-emerald-50"
        labelClass="text-emerald-700"
      />
    </div>
  );
};

export default StatsRow;
