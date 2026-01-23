
import React, { useState, useEffect } from 'react';
import { Plus, Search, Ticket, Filter, Trash2, Copy, Download, AlertTriangle } from 'lucide-react';
import { COLORS } from '../constants';
import { generateVoucherAdCopy } from '../services/geminiService';
import { Voucher } from '../types';

const VoucherManager: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('vouchers') || '[]');
    setVouchers(saved);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const code = `MT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Set manual voucher expiry to 30 days from now
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(now.getDate() + 30);

    setTimeout(() => {
      const newVoucher: Voucher = {
        id: `v_${Date.now()}`,
        code: code,
        plan: 'Mtaani Manual',
        price: 0,
        dataLimit: 'Unlimited',
        timeLimit: 'N/A',
        status: 'available',
        createdAt: now.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0]
      };
      const updated = [newVoucher, ...vouchers];
      setVouchers(updated);
      localStorage.setItem('vouchers', JSON.stringify(updated));
      setIsGenerating(false);
    }, 500);
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#d6d3d1] uppercase tracking-tight">Voucher Vault</h2>
          <p className="text-[#a8a29e]">Manage access tokens and revenue streams.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-4 bg-[#78350f] text-[#d6d3d1] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#92400e] transition-all shadow-xl disabled:opacity-50"
        >
          {isGenerating ? 'GENERATE...' : <><Plus size={18} /> Manual Generate</>}
        </button>
      </div>

      <div className="bg-[#292524] border border-[#44403c] rounded-3xl overflow-hidden shadow-xl">
        {vouchers.length === 0 ? (
          <div className="p-20 text-center text-[#44403c] uppercase font-black tracking-widest border-2 border-dashed border-[#44403c] m-4 rounded-2xl">
            Hakuna vocha zilizotengenezwa
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1c1917] border-b border-[#44403c]">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-[#44403c] uppercase tracking-widest">Code</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#44403c] uppercase tracking-widest">Plan</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#44403c] uppercase tracking-widest">Expiry</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#44403c] uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-[#44403c] uppercase tracking-widest">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#44403c]">
              {vouchers.map((v) => {
                const expiringSoon = isExpiringSoon(v.expiryDate);
                const expired = isExpired(v.expiryDate);

                return (
                  <tr 
                    key={v.id} 
                    className={`transition-colors relative ${
                      expiringSoon 
                        ? 'bg-amber-900/10 border-l-4 border-l-amber-500 hover:bg-amber-900/20' 
                        : expired 
                        ? 'bg-red-900/10 border-l-4 border-l-red-500 hover:bg-red-900/20 opacity-75' 
                        : 'hover:bg-[#44403c]/10'
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#d6d3d1] font-bold text-sm tracking-widest">{v.code}</span>
                        {expiringSoon && <AlertTriangle size={14} className="text-amber-500 animate-pulse" title="Expiring within 7 days!" />}
                        {expired && <AlertTriangle size={14} className="text-red-500" title="Expired!" />}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-[#d6d3d1] uppercase">{v.plan}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`text-[10px] font-mono font-bold ${expiringSoon ? 'text-amber-500' : expired ? 'text-red-500' : 'text-[#a8a29e]'}`}>
                        {v.expiryDate || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        v.status === 'available' ? 'bg-green-900/20 text-green-500 border border-green-500/20' : 
                        v.status === 'active' ? 'bg-blue-900/20 text-blue-500 border border-blue-500/20' :
                        'bg-amber-900/20 text-amber-500 border border-amber-500/20'
                      }`}>
                        {expired ? 'Expired' : v.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[10px] text-[#44403c] font-mono">{v.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VoucherManager;
