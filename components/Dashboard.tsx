
import React, { useState, useEffect } from 'react';
import { Activity, Users, Ticket, ArrowUpRight, ArrowDownRight, Zap, Banknote, MessageCircle, Check, X, Phone, User as UserIcon } from 'lucide-react';
import { getNetworkInsights } from '../services/geminiService';
import { COLORS } from '../constants';
import { BundleRequest } from '../types';

const StatCard = ({ title, value, subValue, icon: Icon, trend }: any) => (
  <div className={`${COLORS.bgCard} p-6 rounded-3xl border ${COLORS.border} flex flex-col gap-4 shadow-xl hover:border-[#78350f]/50 transition-all group`}>
    <div className="flex justify-between items-start">
      <div className="p-3 bg-[#1c1917] rounded-xl border border-[#44403c] group-hover:border-[#78350f]/30 transition-colors">
        <Icon size={20} className="text-[#78350f]" />
      </div>
      {trend && (
        <span className={`text-[10px] font-black flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-400'}`}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-[10px] font-black uppercase text-[#44403c] tracking-[0.2em] mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-[#d6d3d1] tracking-tight">{value}</span>
        {subValue && <span className="text-[10px] text-[#78350f] font-black uppercase tracking-widest">{subValue}</span>}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>("Analyzing network patterns...");
  const [requests, setRequests] = useState<BundleRequest[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const fetchInsight = async () => {
      const data = await getNetworkInsights(customerCount, "0 TB");
      setInsight(data || "System monitoring active. Network load is minimal.");
    };
    fetchInsight();

    const savedRequests = JSON.parse(localStorage.getItem('bundle_requests') || '[]');
    setRequests(savedRequests);
    
    const registry = JSON.parse(localStorage.getItem('customer_registry') || '[]');
    setCustomerCount(registry.length);
  }, []);

  const handleApprove = (req: BundleRequest) => {
    const voucherCode = `MT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const smsMessage = `Habari ${req.customerName}, Vocha yako ya ${req.planName} ni: ${voucherCode}. Asante.`;
    
    const updatedRequests = requests.map(r => 
      r.id === req.id ? { ...r, status: 'approved' as const } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem('bundle_requests', JSON.stringify(updatedRequests));

    const existingVouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    const newVoucher = {
      id: `v_${Date.now()}`,
      code: voucherCode,
      plan: req.planName,
      price: req.planPrice,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    };
    localStorage.setItem('vouchers', JSON.stringify([newVoucher, ...existingVouchers]));

    window.location.href = `sms:${req.customerPhone}?body=${encodeURIComponent(smsMessage)}`;
    alert(`Approved! Voucher: ${voucherCode}`);
  };

  const handleReject = (id: string) => {
    const updatedRequests = requests.map(r => 
      r.id === id ? { ...r, status: 'rejected' as const } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem('bundle_requests', JSON.stringify(updatedRequests));
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const totalRevenue = requests.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.planPrice, 0);

  return (
    <div className="p-8 space-y-10 min-h-screen bg-[#1c1917]">
      <header>
          <h2 className="text-4xl font-black text-[#d6d3d1] uppercase tracking-tighter italic">Command Center</h2>
          <p className="text-[#a8a29e] text-sm font-medium">Real-time surveillance & transaction management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue" value={`Tsh ${totalRevenue}`} icon={Banknote} subValue="Gross" trend={12} />
        <StatCard title="Customers" value={customerCount} icon={Users} trend={5} />
        <StatCard title="Requests" value={pendingCount} icon={MessageCircle} subValue="Waiting" />
        <StatCard title="Core Health" value="Stable" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#292524] border border-[#44403c] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
          <div className="p-8 border-b border-[#44403c] flex justify-between items-center bg-[#1c1917]/50">
            <h3 className="text-xl font-black text-[#d6d3d1] uppercase tracking-tight flex items-center gap-3">
              <Zap size={20} className="text-[#78350f]" /> Pending Approvals
            </h3>
            <span className="text-[10px] font-black bg-[#451a03] px-4 py-1.5 rounded-full text-[#d6d3d1] uppercase tracking-widest">{pendingCount} Active</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            {requests.length === 0 ? (
              <div className="p-20 text-center text-[#44403c] uppercase font-black text-xs tracking-[0.3em]">No incoming requests</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#1c1917]">
                  <tr>
                    <th className="px-8 py-5 text-[9px] font-black text-[#44403c] uppercase tracking-widest">Detail</th>
                    <th className="px-8 py-5 text-[9px] font-black text-[#44403c] uppercase tracking-widest">Payment</th>
                    <th className="px-8 py-5 text-[9px] font-black text-[#44403c] uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#44403c]">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#44403c]/10 transition-colors">
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-[#d6d3d1] uppercase">{req.planName}</div>
                        <div className="text-[10px] text-[#78350f] font-mono mt-1">{req.customerName} | {req.customerPhone}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-green-500">Tsh {req.planPrice}</span>
                          <span className="text-[9px] text-[#a8a29e] uppercase">{req.paymentName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          {req.status === 'pending' ? (
                            <>
                              <button onClick={() => handleApprove(req)} className="p-3 bg-green-900/10 text-green-500 rounded-xl border border-green-500/20 hover:bg-green-500 hover:text-[#1c1917] transition-all"><Check size={18} /></button>
                              <button onClick={() => handleReject(req.id)} className="p-3 bg-red-900/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-[#1c1917] transition-all"><X size={18} /></button>
                            </>
                          ) : (
                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg ${req.status === 'approved' ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'}`}>
                              {req.status}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-[#451a03] rounded-[2.5rem] p-10 flex flex-col gap-8 text-[#d6d3d1] shadow-2xl border border-[#78350f]/30 relative overflow-hidden group">
          <Activity size={200} className="absolute -bottom-20 -left-20 opacity-5 group-hover:scale-110 transition-transform" />
          <div className="relative z-10 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><Zap size={24} className="text-[#78350f]" /> System Intelligence</h3>
            <div className="bg-[#1c1917]/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                <p className="text-sm font-medium italic leading-relaxed text-[#d6d3d1]/80">"{insight}"</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-[#1c1917]/20 rounded-xl border border-white/5">
                  <span className="text-[8px] uppercase font-black text-[#d6d3d1]/40 tracking-widest block mb-1">Peak Time</span>
                  <span className="text-xs font-black">18:00 - 21:00</span>
               </div>
               <div className="p-4 bg-[#1c1917]/20 rounded-xl border border-white/5">
                  <span className="text-[8px] uppercase font-black text-[#d6d3d1]/40 tracking-widest block mb-1">Top Plan</span>
                  <span className="text-xs font-black">Daily Lite</span>
               </div>
            </div>
          </div>
          <button className="mt-auto py-5 bg-[#78350f] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#92400e] transition-all border border-white/10 shadow-xl">Run Network Audit</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
