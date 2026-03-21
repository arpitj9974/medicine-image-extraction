import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, AlertTriangle, AlertCircle, Search, Clock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const MedicineTable = ({ medicines, loading }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredMedicines = medicines.filter(med => 
    (med.medicine_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.batch_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusIcon = ({ status }) => {
    if (status === 'success') return <CheckCircle2 size={16} className="text-emerald-500" title="Success" />;
    if (status === 'partial') return <AlertTriangle size={16} className="text-amber-500" title="Partial" />;
    return <AlertCircle size={16} className="text-red-500" title="Failed" />;
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Table Header / Controls */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Saved Records</h2>
          <p className="text-sm text-slate-500 mt-1">History of all extracted medicines</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or batch..."
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none w-full sm:w-64 transition-shadow bg-slate-50 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Medicine Info</th>
              <th className="px-6 py-4">Batch & Expiry</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status & Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
                    <p>Loading records...</p>
                  </div>
                </td>
              </tr>
            ) : filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Clock size={32} className="text-slate-300 mb-3" />
                    <p className="text-base font-medium text-slate-700">No records found</p>
                    <p className="text-sm mt-1">Either you haven't uploaded yet, or your search didn't match.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMedicines.map((med) => (
                <tr key={med._id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Image Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                      {med.image_url ? (
                        <img 
                          src={getImageUrl(med.image_url)} 
                          alt="Medicine" 
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=Image'; }}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </div>
                  </td>

                  {/* Medicine Info */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 leading-tight">
                      {med.medicine_name || <span className="text-slate-400 italic">Unknown</span>}
                    </div>
                  </td>

                  {/* Batch & Expiry */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-700">
                        <span className="text-slate-400 text-xs mr-1">BNo:</span>
                        {med.batch_number || <span className="italic text-slate-400">-</span>}
                      </span>
                      <span className="text-slate-700">
                        <span className="text-slate-400 text-xs mr-1">EXP:</span>
                        {med.expiry_date || <span className="italic text-slate-400">-</span>}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {med.price ? (
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        ₹{med.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">-</span>
                    )}
                  </td>

                  {/* Status & Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={med.extraction_status} />
                        <span className="text-xs font-medium capitalize text-slate-700">
                          {med.extraction_status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(med.createdAt), 'MMM dd, yyyy • HH:mm')}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineTable;
