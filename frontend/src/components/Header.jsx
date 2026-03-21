import React from 'react';
import { Stethoscope, User, Activity } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm /shadow-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Left Side: Branding */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Stethoscope size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              Medicine Image Extractor
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Upload packaging, extract structured data instantly
            </p>
          </div>
        </div>

        {/* Right Side: Status and User */}
        <div className="flex items-center gap-6 shrink-0 mt-2 sm:mt-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Live System</span>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-800">Company Demo</span>
            <span className="text-xs text-slate-500 font-medium tracking-wide">Administrator</span>
          </div>
          
          <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-slate-600 ring-2 ring-slate-100">
            <User size={18} />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
