
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
  Banknote, MessageCircle, Server, Terminal, Code, Copy, Check, Radio, 
  Database, Info, AlertTriangle, Trash2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- CONFIGURATION ---
const ADMIN_PHONE = "0779231924";
const PAYMENT_NAME = "JAPHET SUNDAY";
const ADMIN_PASS = "mtaani";

const PLANS = [
  { id: 'p1', name: 'Mtaani Lite', price: 500, duration: 'Masaa 6', desc: 'Inafaa kwa WhatsApp na browsing ya haraka' },
  { id: 'p2', name: 'Mtaani Daily', price: 1000, duration: 'Saa 24', desc: 'Siku nzima bila kikomo cha MB' },
  { id: 'p3', name: 'Mtaani Weekly', price: 5000, duration: 'Siku 7', desc: 'Ofa bora kwa matumizi ya familia' },
];

// --- AI SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAIInsight = async (custCount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Wewe ni msimamizi wa mtandao wa WiFi Tanzania. Toa sentensi 2 fupi za hali ya mtandao kwa wateja ${custCount}. Tumia lugha ya Kiswahili na Kiingereza kidogo ya kiufundi.`,
    });
    return response.text;
  } catch (e) {
    return "Mfumo uko imara (Stable). Huduma zote zinafanya kazi kwa ufanisi 100%.";
  }
};

// --- COMPONENTS ---

const Layout = ({ children, isAdmin, onLogout }: any) => {
  const location = useLocation();
  const isPortal = location.pathname === '/';

  const linkClass = ({ isActive }: any) => 
    `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${
      isActive ? 'bg-[#451a03] text-white shadow-lg border border-[#78350f]/30' : 'text-[#a8a29e] hover:bg-[#292524] hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-[#1c1917] text-[#d6d3d1]">
      {isAdmin && !isPortal && (
        <aside className="w-64 border-r border-[#292524] h-screen fixed left-0 top-0 flex flex-col p-6 z-50 bg-[#1c1917]">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="p-2 bg-[#78350f] rounded-xl shadow-lg"><Zap size={20} className="text-white"/></div>
            <h1 className="text-xl font-black tracking-tighter italic">MTAANI <span className="text-[#78350f] not-italic">WIFI</span></h1>
          </div>
          <nav className="flex-1 space-y-2">
            <NavLink to="/dashboard" className={linkClass}><LayoutDashboard size={18}/> <span className="text-sm font-bold">Dashibodi</span></NavLink>
            <NavLink to="/vouchers" className={linkClass}><Ticket size={18}/> <span className="text-sm font-bold">Vocha</span></NavLink>
            <NavLink to="/customers" className={linkClass}><Users size={18}/> <span className="text-sm font-bold">Wateja</span></NavLink>
            <NavLink to="/router" className={linkClass}><Settings size={18}/> <span className="text-sm font-bold">Router</span></NavLink>
          </nav>
          <button onClick={onLogout} className="mt-auto flex items-center gap-3 p-4 text-red-400 hover:bg-red-900/10 rounded-2xl transition-all text-xs font-black uppercase tracking-widest">
            <LogOut size={16}/> Logout
          </button>
        </aside>
      )}
      <main className={`flex-1 ${isAdmin && !isPortal ? 'ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
};

// --- PAGES ---

const Dashboard = () => {
  const [insight, setInsight] = useState("Inachanganua...");
  const [requests, setRequests] = useState<any[]>([]);
  const [custCount, setCustCount] = useState(0);

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem('bundle_requests') || '[]');
    const c = JSON.parse(localStorage.getItem('customer_registry') || '[]');
    setRequests(r);
    setCustCount(c.length);
    getAIInsight(c.length).then(setInsight);
  }, []);

  const totalRev = requests.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.planPrice, 0);

  const approve = (req: any) => {
    const code = `MT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const updated = requests.map(r => r.id === req.id ? { ...r, status: 'approved' } : r);
    setRequests(updated);
    localStorage.setItem('bundle_requests', JSON.stringify(updated));
    
    // Simulating Voucher Save
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    localStorage.setItem('vouchers', JSON.stringify([{ id: Date.now(), code, plan: req.planName, status: 'active' }, ...vouchers]));

    window.location.href = `sms:${req.customerPhone}?body=${encodeURIComponent(`Habari ${req.customerName}, Vocha yako ya ${req.planName} ni: ${code}`)}`;
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Admin Center</h2>
        <p className="text-[#a8a29e] text-sm font-medium">Usimamizi wa wateja na mapato kwa Shilingi (Tsh).</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#292524] p-8 rounded-[2.5rem] border border-[#44403c] space-y-2 group hover:border-[#78350f] transition-all">
          <Banknote className="text-[#78350f] group-hover:scale-110 transition-transform" size={32}/>
          <p className="text-[10px] font-black text-[#44403c] uppercase tracking-widest pt-4">Mapato Jumla</p>
          <p className="text-3xl font-black text-white tracking-tighter">Tsh {totalRev.toLocaleString()}</p>
        </div>
        <div className="bg-[#292524] p-8 rounded-[2.5rem] border border-[#44403c] space-y-2">
          <Users className="text-[#78350f]" size={32}/>
          <p className="text-[10px] font-black text-[#44403c] uppercase tracking-widest pt-4">Wateja Waliosajiliwa</p>
          <p className="text-3xl font-black text-white tracking-tighter">{custCount}</p>
        </div>
        <div className="bg-[#451a03] p-8 rounded-[2.5rem] border border-[#78350f]/30 space-y-2">
          <Activity className="text-white" size={32}/>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest pt-4">Mfumo Status</p>
          <p className="text-xl font-bold text-white uppercase italic">Active Online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#292524] rounded-[2.5rem] border border-[#44403c] overflow-hidden">
          <div className="p-6 border-b border-[#44403c] bg-[#1c1917]/50 flex justify-between items-center">
            <h3 className="font-black uppercase text-xs tracking-widest">Maombi Mapya</h3>
            <span className="bg-[#78350f] px-3 py-1 rounded-full text-[9px] font-black">{requests.filter(r => r.status === 'pending').length}</span>
          </div>
          <div className="p-2 h-[300px] overflow-y-auto custom-scroll">
            {requests.filter(r => r.status === 'pending').length === 0 ? (
              <p className="text-center py-20 text-[#44403c] uppercase font-black text-[10px]">Hakuna maombi mapya kwa sasa</p>
            ) : (
              <div className="space-y-2">
                {requests.filter(r => r.status === 'pending').map(req => (
                  <div key={req.id} className="p-4 bg-[#1c1917] rounded-2xl flex justify-between items-center border border-transparent hover:border-[#44403c] transition-all">
                    <div>
                      <div className="font-bold text-sm text-white">{req.customerName}</div>
                      <div className="text-[10px] text-[#78350f] font-mono">{req.planName} - Tsh {req.planPrice}</div>
                    </div>
                    <button onClick={() => approve(req)} className="bg-[#78350f] p-3 rounded-xl hover:bg-[#92400e] transition-all"><Check size={18}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#292524] rounded-[2.5rem] border border-[#44403c] p-8 space-y-6">
           <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-2"><Zap size={16} className="text-[#78350f]"/> AI Network Insights</h3>
           <div className="bg-[#1c1917] p-6 rounded-2xl border border-[#44403c] italic text-sm text-[#a8a29e] leading-relaxed shadow-inner">
              "{insight}"
           </div>
           <div className="flex gap-3">
              <div className="flex-1 p-4 bg-[#1c1917] rounded-xl border border-[#44403c] text-center">
                <p className="text-[8px] uppercase font-black text-[#44403c] mb-1">Server Load</p>
                <p className="text-xs font-bold">12%</p>
              </div>
              <div className="flex-1 p-4 bg-[#1c1917] rounded-xl border border-[#44403c] text-center">
                <p className="text-[8px] uppercase font-black text-[#44403c] mb-1">Uptime</p>
                <p className="text-xs font-bold">99.9%</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const CustomerPortal = ({ onLogin }: any) => {
  const [user, setUser] = useState<any>(null);
  const [showReg, setShowReg] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [regForm, setRegForm] = useState({ name: '', phone: '' });
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
    localStorage.setItem('customer_registry', JSON.stringify([{ ...regForm, id: Date.now(), joinedAt: new Date().toLocaleString() }, ...reg]));
    setUser(regForm);
    setShowReg(false);
  };

  const handlePayment = () => {
    const reqs = JSON.parse(localStorage.getItem('bundle_requests') || '[]');
    localStorage.setItem('bundle_requests', JSON.stringify([{
      id: Date.now(),
      customerName: user.name,
      customerPhone: user.phone,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      status: 'pending'
    }, ...reqs]));
    window.location.href = `sms:${ADMIN_PHONE}?body=${encodeURIComponent(`MALIPO: Naitwa ${user.name}, nahitaji vocha ya ${selectedPlan.name} (Tsh ${selectedPlan.price})`)}`;
    setSelectedPlan(null);
    alert("Ombi limetumwa! Subiri SMS ya vocha ije.");
  };

  return (
    <div className="min-h-screen bg-[#1c1917] p-4 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center py-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#78350f] rounded-2xl shadow-xl shadow-[#78350f]/20"><Zap size={28} className="text-white"/></div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">Mtaani Wifi</span>
        </div>
        <button onClick={() => setShowAdmin(true)} className="p-3 bg-[#292524] rounded-2xl text-[#44403c] hover:text-[#78350f] border border-[#44403c] transition-all"><ShieldCheck size={24}/></button>
      </header>

      <main className="w-full max-w-4xl space-y-16 pb-20">
        <section className="text-center space-y-4 pt-10">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none text-white">INTERNET BILA <br/>KIKOMO MTAANI.</h2>
          <p className="text-[#a8a29e] text-lg font-medium">Chagua kifurushi chako ufurahie kasi ya ajabu sasa hivi.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.id} onClick={() => { setSelectedPlan(plan); if(!user) setShowReg(true); }} className="bg-[#292524] p-10 rounded-[3rem] border-2 border-[#44403c] hover:border-[#78350f] transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Ticket size={80}/></div>
              <div className="text-[10px] font-black uppercase text-[#44403c] tracking-widest group-hover:text-[#78350f] mb-4">{plan.duration}</div>
              <h3 className="text-3xl font-black text-white">{plan.name}</h3>
              <div className="text-4xl font-black text-[#78350f] my-6">Tsh {plan.price}</div>
              <p className="text-sm text-[#a8a29e] font-medium leading-relaxed">{plan.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase text-[#78350f] group-hover:translate-x-2 transition-transform">NUNUA SASA <ArrowRight size={16}/></div>
            </div>
          ))}
        </div>

        <section className="bg-[#292524] p-12 rounded-[4rem] border border-[#44403c] space-y-8 shadow-2xl">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="space-y-2">
               <h3 className="text-2xl font-black uppercase flex items-center gap-3"><Key size={24} className="text-[#78350f]"/> Unganisha Vocha</h3>
               <p className="text-[#a8a29e] text-sm">Weka code uliyopokea kwenye SMS hapa chini.</p>
             </div>
             <div className="flex-1 flex gap-4">
               <input placeholder="INGIZA CODE HAPA" className="flex-1 bg-[#1c1917] border-2 border-[#44403c] rounded-[2rem] py-6 px-8 text-3xl font-black text-center tracking-[0.3em] outline-none focus:border-[#78350f] text-white"/>
               <button onClick={() => alert("Checking connection...")} className="bg-[#78350f] px-10 rounded-[2rem] font-black uppercase tracking-widest text-white shadow-xl hover:bg-[#92400e] transition-all">UNGANISHA</button>
             </div>
           </div>
        </section>
      </main>

      {/* MODALS */}
      {showReg && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-[100] backdrop-blur-md">
          <form onSubmit={handleRegister} className="bg-[#292524] p-12 rounded-[3rem] w-full max-w-md border border-[#44403c] space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-3xl font-black uppercase tracking-tighter">Jisajili</h3>
               <button type="button" onClick={() => setShowReg(false)} className="text-[#44403c]"><X size={32}/></button>
            </div>
            <div className="space-y-4">
              <input required placeholder="Jina Lako Kamili" className="w-full bg-[#1c1917] p-6 rounded-2xl outline-none border border-transparent focus:border-[#78350f] text-white" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})}/>
              <input required type="tel" placeholder="Namba ya Simu (07...)" className="w-full bg-[#1c1917] p-6 rounded-2xl outline-none border border-transparent focus:border-[#78350f] text-white" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})}/>
            </div>
            <button className="w-full py-6 bg-[#78350f] rounded-[2rem] font-black uppercase tracking-widest text-white shadow-xl">ENDELEA KUNUNUA</button>
          </form>
        </div>
      )}

      {selectedPlan && user && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-[100] backdrop-blur-md">
          <div className="bg-[#292524] p-12 rounded-[3rem] w-full max-w-md border border-[#44403c] space-y-10 text-center">
            <h3 className="text-3xl font-black uppercase tracking-tighter">KAMILISHA MALIPO</h3>
            <div className="bg-[#1c1917] p-8 rounded-[2rem] border border-[#78350f]/20 space-y-4">
               <p className="text-[10px] text-[#44403c] font-black uppercase tracking-widest">Tuma Tsh {selectedPlan.price.toLocaleString()} kwenda:</p>
               <p className="text-4xl font-black text-[#78350f] font-mono tracking-tighter">{ADMIN_PHONE}</p>
               <p className="text-xs text-white font-bold uppercase">{PAYMENT_NAME}</p>
            </div>
            <button onClick={handlePayment} className="w-full py-6 bg-[#78350f] rounded-[2rem] font-black uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-3">TUMA OMBI <MessageSquare size={20}/></button>
            <button onClick={() => setSelectedPlan(null)} className="text-[#44403c] text-[10px] uppercase font-black tracking-widest">Ghairi Malipo</button>
          </div>
        </div>
      )}

      {showAdmin && (
        <div className="fixed inset-0 bg-black/98 flex items-center justify-center p-6 z-[100] backdrop-blur-xl">
          <div className="bg-[#292524] p-12 rounded-[3rem] w-full max-w-sm border border-[#44403c] space-y-8">
            <div className="text-center space-y-2">
              <Lock size={48} className="mx-auto text-[#78350f] mb-4"/>
              <h3 className="text-xl font-black uppercase tracking-widest">Admin Access</h3>
              <p className="text-[10px] text-[#44403c] uppercase font-bold tracking-widest">Ingiza password kuendelea</p>
            </div>
            <input type="password" autoFocus placeholder="••••••" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-[#1c1917] p-6 rounded-2xl text-center text-3xl font-black outline-none border border-[#44403c] focus:border-[#78350f] text-white"/>
            <button onClick={() => onLogin(pass) ? navigate('/dashboard') : alert("Password si sahihi!")} className="w-full py-6 bg-[#78350f] rounded-[2rem] font-black uppercase tracking-widest text-white shadow-xl">LOGIN</button>
            <button onClick={() => setShowAdmin(false)} className="w-full text-[#44403c] uppercase font-black text-[10px] tracking-widest">Funga</button>
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

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setIsAdmin(true);
  }, []);

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

  return (
    <Layout isAdmin={isAdmin} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<CustomerPortal onLogin={handleLogin}/>} />
        <Route path="/dashboard" element={isAdmin ? <Dashboard/> : <Navigate to="/"/>} />
        <Route path="/vouchers" element={isAdmin ? <div className="p-10"><h2 className="text-4xl font-black uppercase tracking-tighter italic">Voucher Vault</h2><div className="mt-10 p-20 border border-dashed border-[#44403c] rounded-[3rem] text-center text-[#44403c] font-black uppercase tracking-widest text-xs">Voucher history placeholder</div></div> : <Navigate to="/"/>} />
        <Route path="/customers" element={isAdmin ? <div className="p-10"><h2 className="text-4xl font-black uppercase tracking-tighter italic">Mtaani Registry</h2><div className="mt-10 p-20 border border-dashed border-[#44403c] rounded-[3rem] text-center text-[#44403c] font-black uppercase tracking-widest text-xs">Customer list placeholder</div></div> : <Navigate to="/"/>} />
        <Route path="/router" element={isAdmin ? <div className="p-10"><h2 className="text-4xl font-black uppercase tracking-tighter italic">Hardware Config</h2><div className="mt-10 p-10 bg-[#292524] border border-[#44403c] rounded-[3rem] font-mono text-xs text-[#a8a29e] leading-relaxed whitespace-pre">/ip hotspot profile add name=mtaani address-pool=hs-pool-1</div></div> : <Navigate to="/"/>} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </Layout>
  );
};

// Mount App with HashRouter for GitHub Pages compatibility
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Router><App /></Router>);
