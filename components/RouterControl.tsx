
import React, { useState, useEffect } from 'react';
import { Server, Shield, RefreshCw, Save, Terminal, Code, Copy, Check, Radio, Wifi, Zap } from 'lucide-react';

const RouterControl: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [nodes, setNodes] = useState([
    { id: 'n1', name: 'Main-Router-01', ip: '192.168.88.1', status: 'Online', load: '12%' },
    { id: 'n2', name: 'East-Node-02', ip: '192.168.88.2', status: 'Offline', load: '0%' },
  ]);

  const routerScript = `/ip hotspot profile
set [ find default=yes ] html-directory=mtaani_portal login-by=http-chap,http-paper,mac-cookie
add dns-name=mtaani.wifi hotspot-address=192.168.88.1 html-directory=flash/hotspot name=mtaani_prof

/ip hotspot
add address-pool=hs-pool-1 disabled=no interface=bridge-hotspot name=mtaani_hotspot profile=mtaani_prof

/ip hotspot walled-garden
add dst-host=mtaani-pay.io
add dst-host=*.google.com`;

  const handleCopy = () => {
    navigator.clipboard.writeText(routerScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      alert("Network Scan Complete: 2 Nodes Found, 14 IP Leases Active.");
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-[#1c1917]">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-[#d6d3d1] uppercase tracking-tighter">ROUTER CONTROL</h2>
          <p className="text-[#a8a29e] text-sm">Hardware synchronization & IP Address management.</p>
        </div>
        <button 
          onClick={simulateScan}
          disabled={scanning}
          className="flex items-center gap-2 px-6 py-3 bg-[#451a03] text-[#d6d3d1] rounded-xl border border-[#78350f]/30 hover:bg-[#78350f] transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          {scanning ? <RefreshCw className="animate-spin" size={16} /> : <Radio size={16} />}
          {scanning ? 'Scanning...' : 'Scan Network'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* IP Assignment Config */}
          <section className="bg-[#292524] border border-[#44403c] rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8 border-b border-[#44403c] pb-4">
              <Server size={24} className="text-[#78350f]" />
              <h3 className="text-xl font-black text-[#d6d3d1] uppercase tracking-tight">IP Address Assignment</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#44403c] uppercase tracking-widest">Dynamic IP Pool Range</label>
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue="192.168.88.10" className="flex-1 bg-[#1c1917] border-2 border-[#44403c] rounded-xl px-4 py-3 text-[#d6d3d1] font-mono outline-none focus:border-[#78350f]" />
                  <span className="text-[#44403c]">—</span>
                  <input type="text" defaultValue="192.168.88.254" className="flex-1 bg-[#1c1917] border-2 border-[#44403c] rounded-xl px-4 py-3 text-[#d6d3d1] font-mono outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#44403c] uppercase tracking-widest">Lease Duration (Hours)</label>
                <input type="number" defaultValue="24" className="w-full bg-[#1c1917] border-2 border-[#44403c] rounded-xl px-4 py-3 text-[#d6d3d1] font-mono outline-none focus:border-[#78350f]" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#44403c] uppercase tracking-widest">Hotspot Gateway IP</label>
                <input type="text" defaultValue="192.168.88.1" className="w-full bg-[#1c1917] border-2 border-[#44403c] rounded-xl px-4 py-3 text-[#d6d3d1] font-mono outline-none focus:border-[#78350f]" />
              </div>
              <div className="flex items-end">
                <button className="w-full py-4 bg-[#78350f] text-[#d6d3d1] rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-[#92400e] transition-all">
                  Apply IP Rules
                </button>
              </div>
            </div>
          </section>

          {/* MikroTik Script Section */}
          <section className="bg-[#292524] border border-[#44403c] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Terminal size={120} className="text-[#d6d3d1]" />
             </div>
            <div className="flex justify-between items-center mb-6 border-b border-[#44403c] pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <Code size={20} className="text-[#78350f]" />
                <h3 className="text-lg font-black text-[#d6d3d1] uppercase tracking-tight">MikroTik RouterOS Script</h3>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-[#44403c] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#d6d3d1] hover:bg-[#57534e] transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-[#1c1917] p-6 rounded-2xl border-2 border-[#44403c] font-mono text-[11px] text-[#a8a29e] overflow-x-auto whitespace-pre leading-relaxed relative z-10">
              {routerScript}
            </div>
          </section>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="bg-[#292524] border border-[#44403c] rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-[12px] font-black text-[#44403c] uppercase tracking-[0.2em] mb-8">Registered Nodes</h3>
            <div className="space-y-4">
              {nodes.map(node => (
                <div key={node.id} className="p-5 bg-[#1c1917] rounded-2xl border border-[#44403c] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${node.status === 'Online' ? 'bg-[#78350f]/20 text-[#78350f]' : 'bg-[#44403c] text-[#a8a29e]'}`}>
                        <Server size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-[#d6d3d1]">{node.name}</div>
                        <div className="text-[10px] text-[#44403c] font-mono uppercase">{node.ip}</div>
                      </div>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${node.status === 'Online' ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-400'}`}>
                      {node.status}
                    </span>
                  </div>
                  {node.status === 'Online' && (
                    <div className="pt-3 border-t border-[#44403c]/30 flex justify-between items-center">
                       <div className="flex flex-col">
                          <span className="text-[8px] text-[#44403c] uppercase font-bold">Node Load</span>
                          <span className="text-xs text-[#d6d3d1] font-black">{node.load}</span>
                       </div>
                       <button className="p-2 text-[#44403c] hover:text-[#78350f] transition-colors"><RefreshCw size={14}/></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#451a03] rounded-[2rem] p-8 flex flex-col gap-4 border border-[#78350f]/20 shadow-2xl">
             <div className="flex items-center gap-3 mb-4">
                <Shield size={24} className="text-[#d6d3d1]" />
                <h4 className="text-sm font-black text-[#d6d3d1] uppercase tracking-widest">Security Protocol</h4>
             </div>
             <p className="text-xs text-[#d6d3d1]/60 leading-relaxed italic">System is currently enforcing MAC-Filtering and Session Isolation for all connected users.</p>
             <button className="w-full py-4 mt-4 bg-white/5 border border-white/10 text-[#d6d3d1] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                Update Firewall Rules
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouterControl;
