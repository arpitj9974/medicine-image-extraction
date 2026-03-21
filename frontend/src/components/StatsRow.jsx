import React from 'react';
import { Database, UploadCloud, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4 transition-all hover:shadow-md">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

const StatsRow = ({ totalRecords, todayUploads, successRate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Total Records" 
        value={totalRecords || 0} 
        icon={Database} 
        colorClass="bg-blue-50 text-blue-600"
      />
      <StatCard 
        title="Today's Uploads" 
        value={todayUploads || 0} 
        icon={UploadCloud} 
        colorClass="bg-indigo-50 text-indigo-600"
      />
      <StatCard 
        title="Success Rate" 
        value={`${successRate || 0}%`} 
        icon={CheckCircle2} 
        colorClass="bg-emerald-50 text-emerald-600"
      />
    </div>
  );
};

export default StatsRow;
