
import React, { useState, useEffect } from 'react';
import { Zap, Key, CheckCircle, ArrowRight, Ticket, LogOut, MessageSquare, X, Lock, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PLANS, ADMIN_PHONE, PAYMENT_NAME } from '../constants';

interface CustomerPortalProps {
  onAdminLogin: (pass: string) => boolean;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ onAdminLogin }) => {
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [regForm, setRegForm] = useState({ name: '', phone: '' });
  const [voucherCode, setVoucherCode] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [paymentForm, setPaymentForm] = useState({ phone: '', name: '' });
  const [showRegStep, setShowRegStep] = useState(false);

  // Admin Login State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('mtaani_customer');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleBundleClick = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    if (!user) {
      setShowRegStep(true);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.name && regForm.phone) {
      const newUser = { name: regForm.name, phone: regForm.phone };
      localStorage.setItem('mtaani_customer', JSON.stringify(newUser));
      
      const registry = JSON.parse(localStorage.getItem('customer_registry') || '[]');
      const exists = registry.find((c: any) => c.phone === newUser.phone);
      if (!exists) {
        registry.push({
          ...newUser,
          id: `cust_${Date.now()}`,
          joinedAt: new Date().toLocaleString()
        });
        localStorage.setItem('customer_registry', JSON.stringify(registry));
      }
      
      setUser(newUser);
      setShowRegStep(false);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAdminLogin(adminPass);
    if (success) {
      navigate('/dashboard');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mtaani_customer');
    setUser(null);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPlan || !paymentForm.phone || !paymentForm.name) return;

    const message = `HOTSPOT REQUEST:\nMteja: ${user.name} (${user.phone})\nKifurushi: ${selectedPlan.name} (Tsh ${selectedPlan.price})\nMALIPO YAKO:\nNamba: ${paymentForm.phone}\nJina: ${paymentForm.name}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `sms:${ADMIN_PHONE}?body=${encodedMessage}`;

    const requests = JSON.parse(localStorage.getItem('bundle_requests') || '[]');
    const newRequest = {
      id: `req_${Date.now()}`,
      customerName: user.name,
      customerPhone: user.phone,
      paymentPhone: paymentForm.phone,
      paymentName: paymentForm.name,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      requestedAt: new Date().toLocaleString(),
      status: 'pending'
    };
    localStorage.setItem('bundle_requests', JSON.stringify([newRequest, ...requests]));
    
    setSelectedPlan(null);
    setPaymentForm({ phone: '', name: '' });
    alert(`Ombi lako limetumwa. Subiri SMS ya vocha ije.`);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  };

  if (connected) {
    return (
      <div className="min-h-screen bg-[#1c1917] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-[#292524] rounded-3xl p-8 border border-[#44403c] shadow-2xl space-y-6">
          <div className="inline-flex p-6 bg-amber-900/10 rounded-full text-[#78350f] mb-2 border border-[#78350f]/20">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-black text-[#d6d3d1]">IMEUNGANISHWA!</h1>
          <p className="text-[#a8a29e]">Karibu {user?.name}, sasa uko hewani.</p>
          <div className="bg-[#1c1917] p-4 rounded-2xl border border-[#44403c]">
            <div className="text-[10px] text-[#a8a29e] uppercase font-bold mb-1 tracking-widest">Muda Uliobakia</div>
            <div className="text-3xl font-mono text-[#78350f] font-black tracking-tighter">05:59:42</div>
          </div>
          <button 
            onClick={() => setConnected(false)}
            className="w-full py-4 bg-[#44403c] text-[#d6d3d1] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#57534e] transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1917] flex flex-col items-center p-4">
      {/* Header with Admin Portal Button */}
      <div className="w-full max-w-6xl flex justify-between items-center py-6 px-4 mb-8">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-[#78350f] rounded-xl shadow-lg">
             <Zap size={24} className="text-[#d6d3d1]" />
           </div>
           <span className="text-xl font-black text-[#d6d3d1] italic tracking-tighter uppercase">Mtaani Wifi</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 border-r border-[#44403c] pr-4">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] text-[#44403c] font-black uppercase tracking-widest">Mteja</span>
                  <span className="text-xs text-[#d6d3d1] font-bold">{user.name}</span>
               </div>
               <button onClick={handleLogout} className="p-2 text-[#44403c] hover:text-red-400 transition-colors">
                 <LogOut size={18} />
               </button>
            </div>
          ) : (
            <div className="hidden md:block text-[10px] text-[#44403c] font-black uppercase tracking-widest bg-[#292524] px-4 py-2 rounded-full border border-[#44403c]">
              System Status: Online
            </div>
          )}
          
          {/* Main Admin Button for Owner to login and check activity */}
          <button 
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#451a03] text-[#d6d3d1] rounded-xl border border-[#78350f]/30 hover:bg-[#78350f] transition-all group"
          >
            <ShieldCheck size={16} className="text-[#78350f] group-hover:text-[#d6d3d1]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Admin Dashboard</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-12 pb-32">
        {/* Bundles Section */}
        <section className="space-y-10">
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-[#d6d3d1] uppercase tracking-tighter leading-none italic">
              Vifurushi vya Internet
            </h2>
            <p className="text-[#a8a29e] text-lg font-medium max-w-xl">
              Chagua ofa inayokufaa ufurahie internet yenye kasi bila kikomo hapa Mtaani kwetu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handleBundleClick(plan)}
                className="relative bg-[#292524] p-10 rounded-[2.5rem] border-2 border-[#44403c] flex flex-col justify-between group transition-all duration-500 hover:border-[#78350f] hover:-translate-y-2 cursor-pointer shadow-xl overflow-hidden"
              >
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#78350f]/5 rounded-full blur-3xl group-hover:bg-[#78350f]/10 transition-all"></div>
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-[#1c1917] rounded-3xl border border-[#44403c] group-hover:border-[#78350f]/40 transition-colors">
                      <Ticket size={32} className="text-[#78350f]" />
                    </div>
                    <div className="bg-[#78350f] text-[#d6d3d1] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {plan.duration}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-[#d6d3d1] uppercase tracking-tight group-hover:text-[#78350f] transition-colors">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-[#a8a29e] font-medium leading-relaxed mt-2 italic opacity-70">
                      {plan.description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-[#44403c] pt-8 mt-12 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#44403c] font-black uppercase tracking-widest mb-1">Gharama</span>
                    <div className="text-4xl font-black text-[#d6d3d1] tracking-tighter">Tsh {plan.price}</div>
                  </div>
                  <div className="flex items-center gap-3 text-[#78350f] group-hover:translate-x-2 transition-transform">
                    <span className="text-[12px] font-black uppercase tracking-widest">NUNUA</span>
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Voucher Input */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-10 border-t border-[#44403c]/30">
          <div className="bg-[#292524] rounded-[3rem] p-10 border border-[#44403c] shadow-2xl space-y-8 order-2 lg:order-1">
            <h2 className="text-2xl font-black text-[#d6d3d1] uppercase tracking-tight flex items-center gap-4">
              <Key size={24} className="text-[#78350f]" /> Tayari Una Vocha?
            </h2>
            <form onSubmit={handleConnect} className="space-y-6">
              <input 
                type="text" 
                placeholder="WEKA CODE HAPA" 
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="w-full bg-[#1c1917] border-2 border-[#44403c] rounded-[2rem] py-8 px-6 text-[#d6d3d1] text-4xl font-mono outline-none focus:border-[#78350f] transition-all text-center tracking-[0.4em] shadow-inner"
              />
              <button 
                disabled={connecting}
                className="w-full py-6 bg-[#78350f] text-[#d6d3d1] rounded-[2rem] font-black text-xl shadow-xl hover:bg-[#92400e] transition-all flex items-center justify-center gap-4 disabled:opacity-50 uppercase tracking-widest"
              >
                {connecting ? 'INAHAKIKI...' : 'UNGANISHA INTERNET'}
              </button>
            </form>
          </div>
          <div className="p-10 space-y-6 order-1 lg:order-2">
            <h3 className="text-2xl font-black text-[#d6d3d1] uppercase italic tracking-tighter">Msaada wa Malipo</h3>
            <div className="flex flex-col gap-6">
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-[#451a03] flex items-center justify-center text-[#d6d3d1] shrink-0 font-black">1</div>
                 <p className="text-[#a8a29e] text-sm">Chagua kifurushi, jaza namba yako na jina.</p>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-[#451a03] flex items-center justify-center text-[#d6d3d1] shrink-0 font-black">2</div>
                 <p className="text-[#a8a29e] text-sm">Lipa kwa MPESA/Tigo Pesa namba <span className="text-[#78350f] font-bold">{ADMIN_PHONE}</span> ({PAYMENT_NAME}).</p>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-[#451a03] flex items-center justify-center text-[#d6d3d1] shrink-0 font-black">3</div>
                 <p className="text-[#a8a29e] text-sm">Utapokea SMS yenye vocha yako papo hapo ukishalipa.</p>
               </div>
            </div>
          </div>
        </section>
      </div>

      {/* Simplified Footer */}
      <footer className="w-full max-w-6xl py-12 border-t border-[#44403c]/20 flex flex-col items-center gap-6">
        <p className="text-[9px] text-[#44403c] font-mono uppercase tracking-[0.3em]">© 2024 MTAANI WIFI SOLUTIONS</p>
      </footer>

      {/* ADMIN LOGIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          <div className="w-full max-w-md bg-[#292524] rounded-[3rem] border border-[#44403c] shadow-2xl overflow-hidden">
            <div className="p-8 bg-[#1c1917] border-b border-[#44403c] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#d6d3d1] uppercase tracking-tight flex items-center gap-3">
                <Lock size={20} className="text-[#78350f]" /> Management Access
              </h3>
              <button onClick={() => setShowAdminModal(false)} className="text-[#44403c] hover:text-[#d6d3d1]"><X size={28}/></button>
            </div>
            <form onSubmit={handleAdminSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#44403c] uppercase tracking-widest px-1">Ingiza Password ya Mfumo</label>
                <input 
                  type="password" required autoFocus
                  className={`w-full bg-[#1c1917] border-2 ${loginError ? 'border-red-500' : 'border-[#44403c]'} rounded-2xl py-5 px-6 text-[#d6d3d1] outline-none focus:border-[#78350f] transition-all`}
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                />
                {loginError && <p className="text-red-500 text-[10px] font-black uppercase text-center mt-2">Password Sio Sahihi!</p>}
              </div>
              <button type="submit" className="w-full py-6 bg-[#78350f] text-[#d6d3d1] rounded-2xl font-black uppercase tracking-widest hover:bg-[#92400e] flex items-center justify-center gap-2">
                <Activity size={18} /> ANGALIA ACTIVITY
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {showRegStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#292524] rounded-[3rem] border border-[#44403c] shadow-2xl overflow-hidden">
            <div className="p-8 bg-[#1c1917] border-b border-[#44403c] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#d6d3d1] uppercase tracking-tight">Jisajili</h3>
              <button onClick={() => setShowRegStep(false)} className="text-[#44403c] hover:text-[#d6d3d1]"><X size={28}/></button>
            </div>
            <form onSubmit={handleRegister} className="p-10 space-y-6">
              <input 
                type="text" required placeholder="Jina Kamili"
                className="w-full bg-[#1c1917] border-2 border-[#44403c] rounded-2xl py-5 px-6 text-[#d6d3d1] outline-none focus:border-[#78350f]"
                value={regForm.name}
                onChange={(e) => setRegForm({...regForm, name: e.target.value})}
              />
              <input 
                type="tel" required placeholder="Namba ya Simu (07...)"
                className="w-full bg-[#1c1917] border-2 border-[#44403c] rounded-2xl py-5 px-6 text-[#d6d3d1] outline-none focus:border-[#78350f]"
                value={regForm.phone}
                onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
              />
              <button type="submit" className="w-full py-6 bg-[#78350f] text-[#d6d3d1] rounded-2xl font-black uppercase tracking-widest hover:bg-[#92400e]">
                ENDELEA
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedPlan && user && !showRegStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#292524] rounded-[3rem] border border-[#44403c] shadow-2xl overflow-hidden">
            <div className="p-8 bg-[#1c1917] border-b border-[#44403c] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#d6d3d1] uppercase tracking-tight">Kamilisha Malipo</h3>
              <button onClick={() => setSelectedPlan(null)} className="text-[#44403c] hover:text-[#d6d3d1]"><X size={28}/></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="bg-[#451a03]/10 border-2 border-[#78350f]/20 p-6 rounded-[2rem] text-center">
                 <p className="text-xs text-[#a8a29e] mb-2 uppercase font-black">Tuma Tsh {selectedPlan.price} kwenda:</p>
                 <div className="text-3xl font-black text-[#78350f] font-mono">{ADMIN_PHONE}</div>
                 <div className="text-[10px] text-[#44403c] font-black uppercase mt-1">{PAYMENT_NAME}</div>
              </div>
              <form onSubmit={handleConfirmPayment} className="space-y-5">
                <input 
                  type="tel" required placeholder="Namba uliyotuma fedha"
                  className="w-full bg-[#1c1917] border-2 border-[#44403c] rounded-2xl py-5 px-6 text-[#d6d3d1] outline-none focus:border-[#78350f]"
                  value={paymentForm.phone}
                  onChange={(e) => setPaymentForm({...paymentForm, phone: e.target.value})}
                />
                <input 
                  type="text" required placeholder="Jina la Malipo"
                  className="w-full bg-[#1c1917] border-2 border-[#44403c] rounded-2xl py-5 px-6 text-[#d6d3d1] outline-none focus:border-[#78350f] uppercase"
                  value={paymentForm.name}
                  onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                />
                <button type="submit" className="w-full py-6 bg-[#78350f] text-[#d6d3d1] rounded-2xl font-black uppercase tracking-widest hover:bg-[#92400e] flex items-center justify-center gap-3">
                  TUMA OMBI <MessageSquare size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
