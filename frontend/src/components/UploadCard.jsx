import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function ImagePreview({ file, previewUrl, onRemove }) {
  if (!previewUrl) return null;
  return (
    <div className="relative rounded-xl overflow-hidden border border-app-border bg-app-bg group transition-all h-full w-full flex items-center justify-center p-2">
      <img src={previewUrl} alt="Preview" className="max-h-[280px] w-auto object-contain rounded-lg" />
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-3 right-3 bg-app-surfaceHover text-app-textMuted p-1.5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 border border-app-border"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
      <div className="absolute bottom-3 left-3 right-3 bg-app-surface/90 backdrop-blur-sm p-2.5 rounded-lg flex items-center gap-2 border border-app-border opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-app-surfaceHover text-app-primary p-1.5 rounded-md shrink-0">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-xs font-semibold text-white truncate">{file.name}</p>
          <p className="text-xs text-app-textMuted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
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
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: !!file || isLoading,
  });

  return (
    <div className="bg-app-surface rounded-xl border border-app-border p-6 shadow-sm flex flex-col h-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors cursor-pointer group
          ${isDragActive ? 'border-app-primary bg-app-primary/5' : ''}
          ${!file && !isDragActive ? 'border-app-border hover:bg-app-surfaceHover/50' : ''}
          ${file ? 'border-transparent bg-transparent p-2 cursor-default' : ''}
        `}
        style={{ minHeight: '320px' }}
      >
        <input {...getInputProps()} />

        {!file ? (
          <>
            <div className="w-16 h-16 bg-app-surfaceHover rounded-full flex items-center justify-center mb-6 group-hover:bg-app-border transition-colors">
              <svg className="h-8 w-8 text-app-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Drop medicine image here</h2>
            <p className="text-sm text-app-textMuted mb-6">Clear photos of packaging work best</p>

            <button
              type="button"
              className="bg-app-primary hover:bg-app-primaryHover text-white font-medium py-2.5 px-8 rounded-lg shadow-sm transition-colors mb-6 w-full sm:w-auto"
            >
              Browse Files
            </button>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['JPG', 'PNG', 'WEBP', 'PDF'].map(ext => (
                <span key={ext} className="px-2.5 py-1 rounded bg-app-bg text-xs font-medium text-app-textMuted border border-app-border">
                  {ext}
                </span>
              ))}
            </div>

            <button className="text-sm text-app-textMuted hover:text-white flex items-center gap-1 transition-colors">
              Try sample image
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {errorStatus && (
              <div className="mt-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium w-full">
                {errorStatus}
              </div>
            )}
          </>
        ) : (
          <ImagePreview file={file} previewUrl={previewUrl} onRemove={() => setFile(null)} />
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-app-bg/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-xl">
            <div className="w-10 h-10 border-4 border-app-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-white font-medium text-sm animate-pulse">Analyzing with AI...</p>
          </div>
        )}
      </div>

      {file && !isLoading && (
        <div className="mt-4">
          <button
            onClick={onUpload}
            className="w-full bg-app-primary hover:bg-app-primaryHover text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Extract Data Now
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
