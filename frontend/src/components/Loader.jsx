import React from 'react';
import { Activity } from 'lucide-react';

const Loader = ({ isLoading, size = 'md', text = 'Processing...' }) => {
  if (!isLoading && text === 'Processing...') return null;

  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative flex items-center justify-center">
        <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-slate-100`}></div>
        <div className={`${sizeClasses[size] || sizeClasses.md} absolute rounded-full border-blue-600 border-t-transparent animate-spin`}></div>
        <Activity size={size === 'lg' ? 20 : 14} className="text-blue-600/40 absolute animate-pulse" />
      </div>
      {text && (
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
