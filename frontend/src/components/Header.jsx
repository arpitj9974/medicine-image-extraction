import React from 'react';
import { Stethoscope } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-2 rounded-lg text-white">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Medicine Image Extractor</h1>
            <p className="text-xs text-slate-500 mt-1">Upload packaging, extract data instantly</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-slate-600">Company Demo</div>
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border border-primary-200 shadow-sm">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
