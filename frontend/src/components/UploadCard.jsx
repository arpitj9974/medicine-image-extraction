import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileImage, X, Loader2 } from 'lucide-react';

const UploadCard = ({ file, setFile, previewUrl, onUpload, isLoading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 5242880, // 5MB
    multiple: false,
    disabled: isLoading,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Upload Medicine Image</h2>
        <p className="text-sm text-slate-500 mt-1">Extract details from packaging</p>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {!file ? (
          <div 
            {...getRootProps()} 
            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer text-center
              ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 bg-slate-50 hover:bg-slate-100'}`}
          >
            <input {...getInputProps()} />
            <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center text-primary-500 mb-4">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-base font-medium text-slate-900 mb-1">
              Drag & drop image here
            </h3>
            <p className="text-sm text-slate-500 mb-4">or click to browse from device</p>
            <div className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
              JPG, PNG supported. Max 5MB.
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="relative flex-1 bg-slate-100 rounded-xl justify-center items-center flex overflow-hidden border border-slate-200 mb-6 p-2">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-64 object-contain rounded-lg shadow-sm"
              />
              {!isLoading && (
                <button 
                  onClick={handleRemove}
                  className="absolute top-3 right-3 bg-white/90 text-slate-700 hover:text-red-500 hover:bg-white p-2 rounded-full shadow-md transition-colors backdrop-blur-sm"
                  title="Remove image"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <FileImage size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            <button
              onClick={onUpload}
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-white font-medium transition-all shadow-sm
                ${isLoading 
                  ? 'bg-primary-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 hover:shadow shadow-primary-500/30 active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Analyzing Image...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={20} />
                  <span>Extract Data Now</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
