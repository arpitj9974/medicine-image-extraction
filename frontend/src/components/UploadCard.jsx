import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, X, FileImage, ExternalLink } from 'lucide-react';
import Loader from './Loader';

function ImagePreview({ file, previewUrl, onRemove }) {
  if (!previewUrl) return null;
  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 group transition-all h-full w-full flex items-center justify-center p-2">
      <img src={previewUrl} alt="Preview" className="max-h-[300px] w-auto object-contain rounded-lg shadow-sm" />
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-600 p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ring-1 ring-slate-200"
      >
        <X size={18} />
      </button>
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-lg flex items-center gap-3 border border-slate-200 shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
        <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md shrink-0">
          <FileImage size={18} />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
          <p className="text-xs text-slate-500 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
      </div>
    </div>
  );
}

const UploadCard = ({ file, setFile, previewUrl, onUpload, isLoading }) => {
  const [errorStatus, setErrorStatus] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setErrorStatus(null);
      if (rejectedFiles && rejectedFiles.length > 0) {
        setErrorStatus('Please upload a valid JPG or PNG image under 5MB.');
        return;
      }
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    multiple: false,
    disabled: !!file || isLoading,
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full ring-1 ring-slate-100">
      
      {/* Premium Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Upload Medicine Image</h2>
        <p className="text-sm font-medium text-slate-500 mt-1 focus:outline-none">Extract details from packaging</p>
      </div>

      <div className="p-6 flex-1 flex flex-col relative w-full h-full min-h-[400px]">
        
        {/* Dropzone Area */}
        <div 
          {...getRootProps()} 
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-300 relative overflow-hidden group 
            ${isDragActive ? 'border-blue-400 bg-blue-50 ring-4 ring-blue-500/10' : ''} 
            ${!file && !isDragActive ? 'border-indigo-100 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer bg-slate-50/30' : ''}
            ${file ? 'border-transparent bg-transparent p-0 cursor-default' : ''}
          `}
          style={{ minHeight: '320px' }}
        >
          <input {...getInputProps()} />

          {!file ? (
            <div className="text-center flex flex-col items-center max-w-sm px-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 shadow-sm
                ${isDragActive ? 'bg-blue-100 text-blue-600 scale-110' : 'bg-white text-indigo-500 shadow-md group-hover:scale-110 ring-1 ring-slate-100'}
              `}>
                <UploadCloud size={36} strokeWidth={2} className={isDragActive ? 'animate-bounce' : ''} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">Drag & drop image here</h3>
              
              <div className="flex items-center gap-2 mb-8 text-slate-400 font-medium">
                <span className="h-px bg-slate-200 flex-1"></span>
                <span className="text-sm uppercase tracking-wider">or</span>
                <span className="h-px bg-slate-200 flex-1"></span>
              </div>
              
              <button 
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                Browse directory
              </button>
              
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase mt-8 bg-slate-100 py-1.5 px-3 rounded-full">
                JPG, PNG. Max 5MB.
              </p>
              
              {errorStatus && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium w-full animate-pulse">
                  {errorStatus}
                </div>
              )}
            </div>
          ) : (
            <ImagePreview 
              file={file} 
              previewUrl={previewUrl} 
              onRemove={() => setFile(null)} 
            />
          )}

          {/* Loader Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-2xl">
               <Loader isLoading={true} size="lg" text="Analyzing image via Gemini AI..." />
            </div>
          )}
        </div>

        {/* Action Button */}
        {file && !isLoading && (
          <div className="mt-6">
            <button 
              onClick={onUpload}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-blue-500/25 transition-all text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
            >
              <UploadCloud size={20} className="mr-1" />
              Extract Data Now
            </button>
          </div>
        )}
        
        {/* Subtle helper link */}
        {!file && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 group">
              <span>Try a sample image</span>
              <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default UploadCard;
