import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, CheckCircle2, AlertTriangle, AlertCircle, FileImage, ExternalLink, Calendar, Hash } from 'lucide-react';
import Loader from './Loader';

const StatusBadge = ({ status }) => {
  const configs = {
    success: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/60', label: 'Success' },
    partial: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/60', label: 'Partial' },
    failed: { icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200/60', label: 'Failed' },
  };
  
  const config = configs[status] || configs.failed;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.bg} ${config.text} border ${config.border} rounded-md text-xs font-bold uppercase tracking-wider`}>
      <Icon size={12} strokeWidth={2.5}/>
      {config.label}
    </div>
  );
};

const MedicineTable = ({ medicines, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(med => {
    const nameMatch = (med.medicine_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const batchMatch = (med.batch_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || batchMatch;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-100 flex flex-col">
      
      {/* Premium Table Header Area */}
      <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-white">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Saved Records</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">History of all extracted medicines</p>
        </div>
        
        <div className="relative w-full sm:w-72 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm font-medium"
            placeholder="Search by name or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center">
          <Loader size="md" text="Loading historical records..." />
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="p-20 text-center flex flex-col items-center justify-center bg-slate-50/50">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
             <Search size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No records found matching your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="p-4 pl-6 md:pl-8 font-semibold w-24">Image</th>
                <th className="p-4 font-semibold min-w-[200px]">Medicine Name</th>
                <th className="p-4 font-semibold min-w-[160px]">Batch & Expiry</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 pr-6 md:pr-8 font-semibold text-right">Status & Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredMedicines.map((med) => (
                <tr key={med._id} className="hover:bg-blue-50/30 transition-colors group">
                  
                  {/* Image Column */}
                  <td className="p-4 pl-6 md:pl-8 align-middle">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm shrink-0">
                      {med.image_url ? (
                        <a href={`http://localhost:3000${med.image_url}`} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                          <img 
                            src={`http://localhost:3000${med.image_url}`} 
                            alt="Medicine Thumbnail" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden absolute inset-0 w-full h-full bg-slate-100 flex-col items-center justify-center text-slate-400">
                             <FileImage size={20} />
                          </div>
                        </a>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <FileImage size={20} />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Medicine Name Column */}
                  <td className="p-4 align-middle">
                    <div className="flex flex-col">
                      {med.medicine_name ? (
                        <span className="font-bold text-slate-900 line-clamp-2 leading-tight">{med.medicine_name}</span>
                      ) : (
                        <span className="font-medium text-slate-400 italic">Not extracted</span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
                        ID: {med._id.substring(med._id.length - 6)}
                      </span>
                    </div>
                  </td>

                  {/* Batch & Expiry Stack */}
                  <td className="p-4 align-middle">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <Hash size={14} className="text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">{med.batch_number || <span className="text-slate-300 italic">N/A</span>}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">{med.expiry_date || <span className="text-slate-300 italic">N/A</span>}</span>
                       </div>
                    </div>
                  </td>

                  {/* Price Column */}
                  <td className="p-4 align-middle">
                    {med.price ? (
                       <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md shadow-sm">
                         <span className="text-emerald-500 text-xs">₹</span>
                         {med.price}
                       </span>
                    ) : (
                       <span className="text-slate-400 italic font-medium text-sm">N/A</span>
                    )}
                  </td>

                  {/* Status & Date Column */}
                  <td className="p-4 pr-6 md:pr-8 align-middle text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge status={med.extraction_status} />
                      <span className="text-xs font-semibold text-slate-400">
                        {format(new Date(med.createdAt), 'MMM dd, yyyy • HH:mm')}
                      </span>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicineTable;
