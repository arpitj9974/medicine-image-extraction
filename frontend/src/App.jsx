import React, { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import Header from './components/Header';
import StatsRow from './components/StatsRow';
import UploadCard from './components/UploadCard';
import ResultCard from './components/ResultCard';
import MedicineTable from './components/MedicineTable';
import { medicineService } from './services/api';

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [medicinesList, setMedicinesList] = useState([]);
  const [isFetchingList, setIsFetchingList] = useState(true);

  // ─── Fetch History on Mount ───
  const fetchList = async () => {
    try {
      setIsFetchingList(true);
      const res = await medicineService.getAllMedicines();
      if (res.success) {
        setMedicinesList(res.data);
      }
    } catch (error) {
      toast.error('Failed to load saved records. Is backend running?');
    } finally {
      setIsFetchingList(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ─── Handle File Preview ───
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    // Cleanup URL
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // ─── Upload & Extract ───
  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setResult(null); // Reset result area
      
      const res = await medicineService.uploadMedicineImage(file);
      
      if (res.success) {
        setResult(res);
        toast.success(res.message || 'Extraction successful!');
        fetchList(); // Refresh table
      } else {
        toast.error(res.message || 'Upload failed');
      }
      
    } catch (error) {
      toast.error(error.message || 'Error communicating with server');
    } finally {
      setIsUploading(false);
    }
  };

  // ─── Calculate Stats ───
  const stats = useMemo(() => {
    const total = medicinesList.length;
    const today = new Date().toDateString();
    const todayUploads = medicinesList.filter(m => new Date(m.createdAt).toDateString() === today).length;
    const successes = medicinesList.filter(m => m.extraction_status === 'success').length;
    const successRate = total > 0 ? Math.round((successes / total) * 100) : 0;
    
    return { totalRecords: total, todayUploads, successRate };
  }, [medicinesList]);

  return (
    <div className="min-h-screen pb-12">
      <Toaster position="top-right" richColors />
      
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Summary Stats */}
        <StatsRow {...stats} />

        {/* Core Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left Column: Upload */}
          <section className="flex flex-col h-full">
            <UploadCard 
              file={file} 
              setFile={setFile} 
              previewUrl={previewUrl} 
              onUpload={handleUpload} 
              isLoading={isUploading} 
            />
          </section>

          {/* Right Column: Result */}
          <section className="flex flex-col h-full">
            <ResultCard 
              result={result} 
              isWaiting={isUploading} 
            />
          </section>

        </div>

        {/* Bottom Workspace: History Table */}
        <section>
          <MedicineTable 
            medicines={medicinesList} 
            loading={isFetchingList} 
          />
        </section>

      </main>
    </div>
  );
}

export default App;
