import React from 'react';
import { BarChart3, PieChart, Activity, Calendar } from 'lucide-react';

const AnalyticsSection = ({ medicines = [] }) => {
  // Simple data processing for visualization
  const total = medicines.length;
  const success = medicines.filter(m => m.extraction_status === 'success').length;
  const partial = medicines.filter(m => m.extraction_status === 'partial').length;
  const failed = medicines.filter(m => m.extraction_status === 'failed').length;

  const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

  return (
    <section id="analytics-section" className="space-y-6 scroll-mt-24 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Analytics</h2>
          <p className="text-app-textMuted text-sm mt-1">Performance and extraction accuracy metrics</p>
        </div>
        <div className="bg-app-surface border border-app-border rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-app-textMuted">
          <Calendar size={16} />
          <span>Last 30 Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Extraction Performance Chart */}
        <div className="lg:col-span-8 bg-app-surface rounded-xl border border-app-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-app-primary/10 text-app-primary">
                <Activity size={20} />
              </div>
              <h3 className="font-semibold text-white">Extraction Accuracy</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1.5 text-app-success">
                <span className="w-2 h-2 rounded-full bg-app-success"></span>
                Success
              </div>
              <div className="flex items-center gap-1.5 text-app-warning">
                <span className="w-2 h-2 rounded-full bg-app-warning"></span>
                Partial
              </div>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[65, 45, 75, 55, 85, 40, 90].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full flex flex-col-reverse gap-0.5 h-full bg-app-bg/30 rounded-t-lg overflow-hidden border border-white/5">
                   <div 
                    className="w-full bg-app-success/40 group-hover:bg-app-success transition-all duration-500 rounded-t-sm" 
                    style={{ height: `${val}%` }}
                   ></div>
                   <div 
                    className="w-full bg-app-warning/40 group-hover:bg-app-warning transition-all duration-500" 
                    style={{ height: `${val / 3}%` }}
                   ></div>
                </div>
                <span className="text-[10px] font-bold text-app-textMuted uppercase tracking-tighter">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-4 bg-app-surface rounded-xl border border-app-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-app-warning/10 text-app-warning">
              <PieChart size={20} />
            </div>
            <h3 className="font-semibold text-white">Distribution</h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-4">
             {/* Simple Ring Chart */}
             <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#1e293b" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="16" fill="transparent" 
                    stroke="#10B981" strokeWidth="3" 
                    strokeDasharray={`${successRate}, 100`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{successRate}%</span>
                  <span className="text-[10px] text-app-textMuted uppercase font-bold tracking-widest">Efficiency</span>
                </div>
             </div>

             <div className="mt-8 w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-app-success"></span>
                    <span className="text-app-textMuted">Success</span>
                  </div>
                  <span className="text-white font-semibold">{success}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-app-warning"></span>
                    <span className="text-app-textMuted">Partial</span>
                  </div>
                  <span className="text-white font-semibold">{partial}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-red-500"></span>
                    <span className="text-app-textMuted">Failed</span>
                  </div>
                  <span className="text-white font-semibold">{failed}</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AnalyticsSection;
