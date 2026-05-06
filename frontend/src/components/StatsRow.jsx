import React, { useEffect, useState } from 'react';

function useAnimatedCount(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const StatsRow = ({ totalRecords = 0, todayUploads = 0, successRate = 0 }) => {
  const animatedTotal = useAnimatedCount(totalRecords);
  const animatedToday = useAnimatedCount(todayUploads);

  const isGood = successRate >= 70;
  const progressColor = isGood ? '#10B981' : '#F59E0B';
  // SVG circle math — circumference of path used in stitch is 100 units
  const dashArray = `${successRate}, 100`;

  return (
    <section aria-label="Key Metrics" className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Total Records */}
      <div className="bg-app-surface rounded-xl border border-app-border p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold text-app-textMuted uppercase tracking-wider mb-1">Total Records</p>
            <h3 className="text-4xl font-bold text-white">{animatedTotal}</h3>
          </div>
          <div className="p-2 rounded-lg bg-app-surfaceHover text-app-primary">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="h-10 mt-2 flex items-end">
          <svg className="w-full h-full text-app-primary opacity-50" preserveAspectRatio="none" viewBox="0 0 100 20">
            <path d="M0,10 C20,20 40,0 60,10 C80,20 100,5 100,5" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* Today's Uploads */}
      <div className="bg-app-surface rounded-xl border border-app-border p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold text-app-textMuted uppercase tracking-wider mb-1">Today's Uploads</p>
            <h3 className="text-4xl font-bold text-white">{animatedToday}</h3>
          </div>
          <div className="p-2 rounded-lg bg-app-surfaceHover text-app-primary">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="h-10 mt-2 flex items-end">
          <svg className="w-full h-full text-app-primary opacity-50" preserveAspectRatio="none" viewBox="0 0 100 20">
            <path d="M0,15 C30,15 40,5 70,10 C90,12 100,2 100,2" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-app-surface rounded-xl border border-app-border p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold text-app-textMuted uppercase tracking-wider mb-1">Success Rate</p>
            <div className="flex items-center gap-2 mt-1">
              <svg className="h-4 w-4 text-app-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="text-sm text-app-textMuted">vs last week</span>
            </div>
          </div>
          {/* Radial Progress */}
          <div className="relative w-14 h-14">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-app-surfaceHover"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke={progressColor} strokeDasharray={dashArray} strokeWidth="3"
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{successRate}%</span>
            </div>
          </div>
        </div>
        <div className="h-10 mt-2 flex items-end">
          <svg className="w-full h-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 20"
            style={{ color: progressColor }}>
            <path d="M0,10 C20,15 40,5 60,15 C80,25 100,5 100,5" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

    </section>
  );
};

export default StatsRow;
