import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const isSuccess = status === 'success';
  const isPartial = status === 'partial';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
      ${isSuccess ? 'bg-app-successBg text-app-success border-app-success/20' :
        isPartial ? 'bg-app-warningBg text-app-warning border-app-warning/20' :
        'bg-red-500/10 text-red-400 border-red-500/20'}
    `}>
      {isSuccess ? (
        <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ) : (
        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )}
      {status.toUpperCase()}
    </span>
  );
};

// Field icons as inline SVG to match Stitch exactly
const fieldIcons = {
  name: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  calendar: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  hash: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  tag: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
};

const FieldCard = ({ icon, label, value, isLoading }) => (
  <div className="bg-app-bg rounded-lg p-4 border border-app-border flex flex-col justify-center min-h-[90px]">
    <div className="flex items-center gap-2 text-app-textMuted mb-2">
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    {isLoading ? (
      <div className="h-4 w-2/3 bg-app-surfaceHover rounded animate-pulse mt-1"></div>
    ) : value ? (
      <p className="text-sm font-semibold text-white leading-snug">{value}</p>
    ) : (
      <div className="h-4 w-2/3 bg-app-surfaceHover rounded animate-pulse mt-1"></div>
    )}
  </div>
);

const ResultCard = ({ result, isWaiting }) => {
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    if (result && !isWaiting) {
      const t = setTimeout(() => setShowData(true), 100);
      return () => clearTimeout(t);
    } else {
      setShowData(false);
    }
  }, [result, isWaiting]);

  const handleCopy = () => {
    if (!result) return;
    const data = result.data || result;
    navigator.clipboard.writeText(
      `Name: ${data.medicine_name || 'N/A'}\nExpiry: ${data.expiry_date || 'N/A'}\nBatch: ${data.batch_number || 'N/A'}\nPrice: ${data.price || 'N/A'}`
    );
    toast.success('Copied to clipboard');
  };

  const handleExport = () => {
    if (!result) return;
    const data = result.data || result;
    const csv = `Medicine Name,Expiry Date,Batch Number,Price\n"${data.medicine_name || ''}","${data.expiry_date || ''}","${data.batch_number || ''}","${data.price || ''}"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'extraction_result.csv';
    a.click();
  };

  const data = result ? (result.data || result) : null;
  const status = data ? (data.extraction_status || result?.status || null) : null;
  const isDataReady = showData && data;

  return (
    <div className="bg-app-surface rounded-xl border border-app-border p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Extraction Result</h2>
        {isDataReady && status && (
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            {result && (
              <button onClick={handleCopy} title="Copy" className="p-1.5 rounded text-app-textMuted hover:text-white hover:bg-app-surfaceHover transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            )}
            {result && (
              <button onClick={handleExport} title="Export CSV" className="p-1.5 rounded text-app-textMuted hover:text-white hover:bg-app-surfaceHover transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start">
        <FieldCard
          icon={fieldIcons.name}
          label="Medicine Name"
          value={isDataReady ? data.medicine_name : null}
          isLoading={!isDataReady}
        />
        <FieldCard
          icon={fieldIcons.calendar}
          label="Expiry Date"
          value={isDataReady ? data.expiry_date : null}
          isLoading={!isDataReady}
        />
        <FieldCard
          icon={fieldIcons.hash}
          label="Batch Number"
          value={isDataReady ? data.batch_number : null}
          isLoading={!isDataReady}
        />
        <FieldCard
          icon={fieldIcons.tag}
          label="MRP Price"
          value={isDataReady && data.price ? `₹ ${data.price}` : null}
          isLoading={!isDataReady}
        />
      </div>
    </div>
  );
};

export default ResultCard;
