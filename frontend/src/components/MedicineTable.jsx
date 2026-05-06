import React, { useState } from 'react';
import { format } from 'date-fns';
import Loader from './Loader';

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

const MedicineTable = ({ medicines, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const filteredMedicines = medicines.filter(med => {
    const nameMatch = (med.medicine_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const batchMatch = (med.batch_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || batchMatch;
  });

  const totalPages = Math.ceil(filteredMedicines.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredMedicines.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: document.getElementById('saved-records')?.offsetTop - 100, behavior: 'smooth' });
  };

  return (
    <section id="saved-records" aria-label="Saved Records" className="bg-app-surface rounded-xl border border-app-border shadow-sm flex flex-col scroll-mt-24">

      {/* Header */}
      <div className="p-6 border-b border-app-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Saved Records</h2>
          <p className="text-sm text-app-textMuted mt-1">History of all extracted medicines</p>
        </div>
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-app-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-app-border rounded-lg leading-5 bg-app-bg text-app-textMain placeholder-app-textMuted focus:outline-none focus:ring-1 focus:ring-app-primary focus:border-app-primary sm:text-sm transition-colors"
            placeholder="Search by name or batch..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="p-16 flex justify-center">
          <Loader size="md" text="Loading historical records..." />
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="p-20 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 bg-app-surfaceHover rounded-xl flex items-center justify-center mb-4">
            <svg className="h-7 w-7 text-app-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="text-app-textMuted font-medium">No records found matching your search.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-app-border text-sm">
              <thead className="bg-app-bg/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-app-textMuted uppercase tracking-wider w-16" scope="col">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-app-textMuted uppercase tracking-wider" scope="col">Medicine Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-app-textMuted uppercase tracking-wider" scope="col">Batch & Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-app-textMuted uppercase tracking-wider" scope="col">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-app-textMuted uppercase tracking-wider" scope="col">Status & Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border bg-app-surface">
                {currentRecords.map((med) => (
                  <tr key={med._id} className="hover:bg-app-surfaceHover/30 transition-colors">

                    {/* Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded bg-app-bg border border-app-border overflow-hidden flex items-center justify-center">
                        {med.image_url ? (
                          <a href={`http://localhost:3000${med.image_url}`} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                            <img
                              src={`http://localhost:3000${med.image_url}`}
                              alt="Medicine Thumbnail"
                              className="h-full w-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </a>
                        ) : (
                          <svg className="h-5 w-5 text-app-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      {med.medicine_name ? (
                        <div className="font-medium text-white line-clamp-2">{med.medicine_name}</div>
                      ) : (
                        <div className="text-app-textMuted italic">Not extracted</div>
                      )}
                      <div className="text-xs text-app-textMuted mt-1">ID: {med._id.slice(-6).toUpperCase()}</div>
                    </td>

                    {/* Batch & Expiry */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-app-textMain mb-1">
                        <span className="text-app-textMuted mr-2 w-4">#</span>
                        {med.batch_number || <span className="text-app-textMuted italic">N/A</span>}
                      </div>
                      <div className="flex items-center text-sm text-app-textMuted">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        {med.expiry_date || <span className="italic">N/A</span>}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {med.price ? (
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-app-successBg text-app-success border border-app-success/20">
                          ₹ {med.price}
                        </span>
                      ) : (
                        <span className="text-app-textMuted italic text-sm">N/A</span>
                      )}
                    </td>

                    {/* Status & Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={med.extraction_status} />
                        <div className="text-xs text-app-textMuted">
                          {format(new Date(med.createdAt), 'MMM dd, yyyy • HH:mm')}
                        </div>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-app-border flex items-center justify-between">
            <div className="text-sm text-app-textMuted">
              Showing <span className="font-medium text-white">{indexOfFirstRecord + 1}</span> to{' '}
              <span className="font-medium text-white">{Math.min(indexOfLastRecord, filteredMedicines.length)}</span> of{' '}
              <span className="font-medium text-white">{filteredMedicines.length}</span> records
            </div>
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded bg-app-bg border border-app-border text-app-textMuted hover:text-white hover:bg-app-surfaceHover disabled:opacity-50 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded font-medium transition-colors text-sm
                      ${currentPage === i + 1
                        ? 'bg-app-primary text-white'
                        : 'bg-app-bg border border-app-border text-app-textMuted hover:text-white hover:bg-app-surfaceHover'}
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded bg-app-bg border border-app-border text-app-textMuted hover:text-white hover:bg-app-surfaceHover disabled:opacity-50 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default MedicineTable;
