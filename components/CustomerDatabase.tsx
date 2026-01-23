
import React, { useState, useEffect } from 'react';
import { Users, Wifi, Clock, Database, Ban, Info } from 'lucide-react';

const CustomerDatabase: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const registry = JSON.parse(localStorage.getItem('customer_registry') || '[]');
    setCustomers(registry);
  }, []);

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-[#d6d3d1] uppercase tracking-tight">REGISTRY</h2>
          <p className="text-[#a8a29e]">Historical record of all connected Mtaani nodes.</p>
        </div>
        <div className="bg-[#292524] px-4 py-3 rounded-2xl border border-[#44403c] flex items-center gap-3">
          <Database size={18} className="text-[#78350f]" />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#44403c]">Unique Profiles</div>
            <div className="text-sm font-black text-[#d6d3d1]">{customers.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {customers.length === 0 ? (
          <div className="bg-[#292524] border border-dashed border-[#44403c] rounded-3xl p-12 text-center text-[#44403c] uppercase font-black tracking-widest">
            Hakuna wateja waliojisajili bado
          </div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="bg-[#292524] border border-[#44403c] rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#78350f]/30 transition-all group shadow-sm">
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#78350f]/20 shadow-[0_0_10px_rgba(120,53,15,0.2)]">
                  <Users size={20} className="text-[#78350f]" />
                </div>
                <div>
                  <h4 className="font-black text-[#d6d3d1] text-sm uppercase">
                    {customer.name}
                  </h4>
                  <div className="text-[10px] text-[#78350f] font-mono tracking-widest">{customer.phone}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 px-4">
                <div>
                  <div className="text-[9px] uppercase font-black text-[#44403c] mb-1">Joined At</div>
                  <div className="text-xs text-[#d6d3d1] font-mono">{customer.joinedAt}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-black text-[#44403c] mb-1">Status</div>
                  <div className="text-xs text-[#a8a29e] flex items-center gap-1">Registered</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-black text-[#44403c] mb-1">ID</div>
                  <div className="text-xs text-[#44403c] font-mono uppercase truncate max-w-[100px]">{customer.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-3 bg-[#78350f] text-[#d6d3d1] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#92400e] transition-all shadow-md">
                  View History
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerDatabase;
