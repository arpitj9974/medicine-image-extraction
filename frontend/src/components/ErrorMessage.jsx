import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
        <XCircle size={28} />
      </div>
      <h3 className="text-lg font-bold text-red-900 mb-1">Upload Error</h3>
      <p className="text-red-700 font-medium mb-6 max-w-xs">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-xl hover:bg-red-100 transition-colors shadow-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
