
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  useLocation, 
  Navigate, 
  useNavigate,
  NavLink 
} from 'react-router-dom';
import { 
  Zap, Key, CheckCircle, ArrowRight, Ticket, LogOut, MessageSquare, 
  X, Lock, ShieldCheck, Activity, LayoutDashboard, Users, Settings,
  Banknote, MessageCircle, ArrowUpRight, ArrowDownRight, Server,
  Terminal, Code, Copy, Check, Radio, Trash2, Plus, Info, Database
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- CONSTANTS ---
const ADMIN_PHONE = "0779231924";
const PAYMENT_NAME = "JAPHET SUNDAY";
const ADMIN_PASS = "mtaani";

const PLANS = [
  { id: 'p1', name: 'Mtaani Lite', price: 500, duration: 'Masaa 6', description: 'Inafaa kwa matumizi ya haraka' },
  { id: 'p2', name: 'Mtaani Daily', price: 1000, duration: 'Saa 24', description: 'Siku nzima bila kikomo' },
  { id: 'p3', name: 'Mtaani Weekly', price: 5000, duration: 'Siku 7', description: 'Ofa bora kwa familia' },
];

// --- GEMINI SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getNetworkInsights = async (customerCount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Toa muhtasari mfupi (sentensi 2) wa hali ya mtandao kwa sasa wenye wateja ${customerCount}. Tumia lugha ya kitaalamu ya kiufundi.`,
    });
    return response.text;
  } catch (error) {
    return "Mfumo uko imara. Hakuna hitilafu yoyote iliyoripotiwa kwa sasa.";
  }
};

// --- COMPONENTS ---

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive 
        ? 'bg-[#451a03] text-[#d6d3d1] shadow-lg border border-[#78350f]/30' 
        : 'text-[#a8a29e] hover:bg-[#292524] hover:text-[#d6d3d1]'
    }`;

  return (
    <div className="w-64 bg-[#1c1917] border-r border-[#292524] h-screen flex flex-col p-4 fixed left-0 top-0 z-40">
      <div className="flex items-center gap-3 px-2 py-6 mb-8">
        <div className="p-2 bg-[#78350f] rounded-xl shadow-lg shadow-[#78350f]/20">
          <Zap size={20} className="text-[#d6d3d1]" />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-[#d6d3d1] italic">MTAANI <span className="text-[#78350f] not-italic">WIFI</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink to="/dashboard" className={linkClasses}><LayoutDashboard size={18} /> <span className="text-sm font-bold">Dashibodi</span></NavLink>
        <NavLink to="/vouchers" className={linkClasses}><Ticket size={18} /> <span className="text-sm font-bold">Vocha</span></NavLink>
        <NavLink to="/customers" className={linkClasses}><Users size={18} /> <span className="text-sm font-bold">Wateja</span></NavLink>
        <NavLink to="/router" className={linkClasses}><Settings size={18} /> <span className="text-sm font-bold">Router</span></NavLink>
      </nav>

      <button onClick={onLogout} className="mt-auto flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-xs font-black uppercase">
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [insight, setInsight] = useState("Inachakata...");
  const [requests, setRequests] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem('bundle_requests') || '[]');
    const c = JSON.parse(localStorage.getItem('customer_registry') || '[]');
    setRequests(r);
    setCustomers(c);
    getNetworkInsights(c.length).then(setInsight);
  }, []);

  const totalRevenue = useMemo(() => 
    requests.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.planPrice, 0),
  [requests]);

  const handleApprove = (req: any) => {
    const code = `MT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const updated = requests.map(r => r.id === req.id ? { ...r, status: 'approved' } : r);
    setRequests(updated);
    localStorage.setItem('bundle_requests', JSON.stringify(updated));
    
    // SMS Link Simulation
    window.location.href = `sms:${req.customerPhone}?body=${encodeURIComponent(`Habari ${req.customerName}, Vocha yako ya ${req.planName} ni: ${code}`)}`;
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-[#1c1917]">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-[#d6d3d1] uppercase tracking-tighter">Command Center</h2>
          <p className="text-[#a8a29e] text-sm">Ufuatiliaji wa Mapato na Maombi.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#292524] p-6 rounded-[2rem] border border-[#44403c] space-y-2">
          <Banknote className="text-[#78350f]" size={24} />
          <p className="text-[10px] font-black text-[#44403c] uppercase tracking-widest">Mapato</p>
          <p className="text-2xl font-black text-[#d6d3d1]">Tsh {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#292524] p-6 rounded-[2rem] border border-[#44403c] space-y-2">
          <Users className="text-[#78350f]" size={24} />
          <p className="text-[10px] font-black text-[#44403c] uppercase tracking-widest">Wateja</p>
          <p className="text-2xl font-black text-[#d6d3d1]">{customers.length}</p>
        </div>
        <div className="bg-[#292524] p-6 rounded-[2rem] border border-[#44403c] space-y-2">
          <MessageCircle className="text-[#78350f]" size={24} />
          <p className="text-[10px] font-black text-[#44403c] uppercase tracking-widest">Maombi</p>
          <p className="text-2xl font-black text-[#d6d3d1]">{requests.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="bg-[#451a03] p-6 rounded-[2rem] border border-[#78350f]/30 space-y-2">
          <Activity className="text-[#d6d3d1]" size={24} />
          <p className="text-[10px] font-black text-[#d6d3d1]/40 uppercase tracking-widest">Health</p>
          <p className="text-lg font-bold text-[#d6d3d1]">Stable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#292524] rounded-[2.5rem] border border-[#44403c] overflow-hidden">
          <div className="p-6 border-b border-[#44403c] flex justify-between items-center bg-[#1c1917]/50">
            <h3 className="font-black uppercase text-xs tracking-widest text-[#d6d3d1]">Maombi ya Vocha</h3>
          </div>
          <div className="p-4 overflow-x-auto">
             {requests.length === 0 ? <p className="text-center py-10 text-[#44403c] uppercase font-black text-[10px]">Hakuna maombi mapya</p> : (
               <table className="w-full text-left">
                  <thead className="text-[10px] text-[#44403c] uppercase">
                    <tr><th className="p-4">Mteja</th><th className="p-4">Kifurushi</th><th className="p-4">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#44403c]">
                    {requests.map(req => (
                      <tr key={req.id}>
                        <td className="p-4"><div className="font-bold text-sm">{req.customerName}</div><div className="text-[10px] text-[#44403c]">{req.customerPhone}</div></td>
                        <td className="p-4 font-black text-[#78350f]">Tsh {req.planPrice}</td>
                        <td className="p-4">
                          {req.status === 'pending' ? (
                            <button onClick={() => handleApprove(req)} className="bg-[#78350f] p-2 rounded-lg text-white"><Check size={16}/></button>
                          ) : <span className="text-[9px] uppercase font-black text-green-500">{req.status}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             )}
          </div>
        </div>
        <div className="bg-[#292524] rounded-[2.5rem] border border-[#44403c] p-8 space-y-6">
           <h3 className="font-black uppercase text-xs tracking-widest text-[#d6d3d1] flex items-center gap-2"><Zap size={16} className="text-[#78350f]"/> AI Insight</h3>
           <div className="bg-[#1c1917] p-6 rounded-2xl border border-[#44403c] italic text-sm text-[#a8a29e]">
              "{insight}"
           </div>
           <button className="w-full py-4 bg-[#78350f] rounded-xl text-[10px] font-black uppercase tracking-widest">Refresh Scan</button>
        </div>
      </div>
    </div>
  );
};

const CustomerPortal = ({ onAdminLogin }: { onAdminLogin: (p: string) => boolean }) => {
  const [user, setUser] = useState<any>(null);
  const [showReg, setShowReg] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '' });
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [voucher, setVoucher] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('mtaani_customer');
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleRegister = (e: any) => {
    e.preventDefault();
    localStorage.setItem('mtaani_customer', JSON.stringify(regForm));
    const reg = JSON.parse(localStorage.getItem('customer_registry') || '[]');
    localStorage.setItem('customer_registry', JSON.stringify([...reg, { ...regForm, id: Date.now() }]));
    setUser(regForm);
    setShowReg(false);
  };

  const handlePayment = (e: any) => {
    e.preventDefault();
    const reqs = JSON.parse(localStorage.getItem('bundle_requests') || '[]');
    localStorage.setItem('bundle_requests', JSON.stringify([{
      id: Date.now(),
      customerName: user.name,
      customerPhone: user.phone,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      status: 'pending'
    }, ...reqs]));
    window.location.href = `sms:${ADMIN_PHONE}?body=${encodeURIComponent(`MALIPO: ${user.name} anahitaji ${selectedPlan.name} (Tsh ${selectedPlan.price})`)}`;
    setSelectedPlan(null);
    alert("Ombi limetumwa! Subiri SMS ya vocha.");
  };

  return (
    <div className="min-h-screen bg-[#1c1917] p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#78350f] rounded-xl"><Zap size={24} className="text-white"/></div>
          <span className="text-xl font-black italic tracking-tighter">MTAANI WIFI</span>
        </div>
        <button onClick={() => setShowAdmin(true)} className="p-3 bg-[#292524] rounded-xl text-[#44403c] hover:text-[#78350f]"><ShieldCheck size={20}/></button>
      </header>

      <main className="w-full max-w-4xl space-y-12 py-10">
        <section className="text-center space-y-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter italic">Vifurushi vya Leo</h2>
          <p className="text-[#a8a29e]">Internet isiyo na kikomo kwa bei nafuu.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.id} onClick={() => { setSelectedPlan(plan); if(!user) setShowReg(true); }} className="bg-[#292524] p-8 rounded-[2rem] border border-[#44403c] hover:border-[#78350f] transition-all cursor-pointer group">
              <div className="text-[10px] font-black uppercase text-[#44403c] group-hover:text-[#78350f]">{plan.duration}</div>
              <h3 className="text-2xl font-black mt-2">{plan.name}</h3>
              <div className="text-3xl font-black text-[#78350f] mt-6">Tsh {plan.price}</div>
              <p className="text-xs text-[#a8a29e] mt-4">{plan.description}</p>
            </div>
          ))}
        </div>

        <section className="bg-[#292524] p-10 rounded-[3rem] border border-[#44403c] space-y-6">
           <h3 className="text-xl font-black uppercase flex items-center gap-3"><Key size={20} className="text-[#78350f]"/> Tayari Una Vocha?</h3>
           <div className="flex gap-4">
             <input value={voucher} onChange={e => setVoucher(e.target.value.toUpperCase())} placeholder="INGIZA CODE HAPA" className="flex-1 bg-[#1c1917] border-2 border-[#44403c] rounded-2xl p-6 text-3xl font-black text-center tracking-widest outline-none focus:border-[#78350f]"/>
             <button onClick={() => alert("Checking connection...")} className="bg-[#78350f] px-8 rounded-2xl font-black uppercase tracking-widest">Unganisha</button>
           </div>
        </section>
      </main>

      {/* MODALS */}
      {showReg && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <form onSubmit={handleRegister} className="bg-[#292524] p-10 rounded-[2.5rem] w-full max-w-md border border-[#44403c] space-y-6">
            <h3 className="text-2xl font-black">Jisajili</h3>
            <input required placeholder="Jina Lako" className="w-full bg-[#1c1917] p-5 rounded-2xl outline-none" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})}/>
            <input required placeholder="Namba ya Simu" className="w-full bg-[#1c1917] p-5 rounded-2xl outline-none" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})}/>
            <button className="w-full py-5 bg-[#78350f] rounded-2xl font-black uppercase">Endelea</button>
          </form>
        </div>
      )}

      {selectedPlan && user && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <div className="bg-[#292524] p-10 rounded-[2.5rem] w-full max-w-md border border-[#44403c] space-y-8 text-center">
            <h3 className="text-2xl font-black uppercase">Lipa Sasa</h3>
            <div className="bg-[#1c1917] p-6 rounded-2xl border border-[#78350f]/20">
               <p className="text-xs text-[#44403c] font-black uppercase">Tuma Tsh {selectedPlan.price} kwenda:</p>
               <p className="text-3xl font-black text-[#78350f] mt-2">{ADMIN_PHONE}</p>
               <p className="text-[10px] text-[#44403c] mt-1">{PAYMENT_NAME}</p>
            </div>
            <button onClick={handlePayment} className="w-full py-5 bg-[#78350f] rounded-2xl font-black uppercase">Tuma Ombi la Vocha</button>
            <button onClick={() => setSelectedPlan(null)} className="text-[#44403c] text-xs uppercase font-black">Ghairi</button>
          </div>
        </div>
      )}

      {showAdmin && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-50">
          <div className="bg-[#292524] p-10 rounded-[2.5rem] w-full max-w-sm border border-[#44403c] space-y-6">
            <h3 className="text-xl font-black uppercase text-center">Admin Login</h3>
            <input type="password" autoFocus placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-[#1c1917] p-5 rounded-2xl text-center text-2xl"/>
            <button onClick={() => onAdminLogin(pass) ? navigate('/dashboard') : alert("Kosa!")} className="w-full py-5 bg-[#78350f] rounded-2xl font-black uppercase">Login</button>
            <button onClick={() => setShowAdmin(false)} className="w-full text-[#44403c] uppercase font-black text-xs">Funga</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP ROOT ---
const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const handleLogin = (p: string) => {
    if (p === ADMIN_PASS) {
      setIsAdmin(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('admin_auth');
  };

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setIsAdmin(true);
  }, []);

  const isPortal = location.pathname === '/';

  return (
    <div className="flex min-h-screen bg-[#1c1917]">
      {isAdmin && !isPortal && <Sidebar onLogout={handleLogout} />}
      <main className={`flex-1 ${isAdmin && !isPortal ? 'ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<CustomerPortal onAdminLogin={handleLogin} />} />
          <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/vouchers" element={isAdmin ? <div className="p-8"><h2 className="text-3xl font-black">Voucher Vault</h2><p className="mt-4 text-[#44403c]">Ukurasa huu unakamilika...</p></div> : <Navigate to="/" />} />
          <Route path="/customers" element={isAdmin ? <div className="p-8"><h2 className="text-3xl font-black">Customer Registry</h2><p className="mt-4 text-[#44403c]">Ukurasa huu unakamilika...</p></div> : <Navigate to="/" />} />
          <Route path="/router" element={isAdmin ? <div className="p-8"><h2 className="text-3xl font-black">Router Config</h2><p className="mt-4 text-[#44403c]">Ukurasa huu unakamilika...</p></div> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Router><App /></Router>);
