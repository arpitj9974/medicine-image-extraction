import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-app-surface/80 backdrop-blur-md border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-app-primary flex items-center justify-center text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-app-textMain">MedExtract</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white px-3 py-2 rounded-md text-sm font-medium border-b-2 border-app-primary"
            >
              Dashboard
            </button>
            <a 
              href="#analytics-section" 
              className="text-app-textMuted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Analysis
            </a>
            <a 
              href="#saved-records" 
              className="text-app-textMuted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Records
            </a>
          </nav>

          {/* Right: Live + User */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-app-successBg border border-app-success/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-app-success"></span>
              </span>
              <span className="text-xs font-medium text-app-success uppercase tracking-wider">Live</span>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-app-border">
              <span className="text-sm font-medium hidden md:block text-app-textMain">Dr. Sarah</span>
              <div className="w-8 h-8 rounded-full bg-app-surfaceHover flex items-center justify-center border border-app-border cursor-pointer hover:bg-app-border transition-colors">
                <svg className="h-4 w-4 text-app-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
