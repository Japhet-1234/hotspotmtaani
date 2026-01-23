import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import VoucherManager from './components/VoucherManager.tsx';
import CustomerDatabase from './components/CustomerDatabase.tsx';
import RouterControl from './components/RouterControl.tsx';
import CustomerPortal from './components/CustomerPortal.tsx';

/**
 * AppContent handles the layout and routing logic.
 * HashRouter used here is best for GitHub Pages as it avoids 404 on refresh.
 */
const AppContent: React.FC = () => {
  const location = useLocation();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  useEffect(() => {
    const status = sessionStorage.getItem('admin_auth');
    if (status === 'true') setIsAdminLoggedIn(true);
  }, []);

  const handleAdminLogin = (pass: string): boolean => {
    if (pass === 'mtaani') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('admin_auth');
  };

  const isPortalView = location.pathname === '/' || location.pathname === '/portal';

  return (
    <div className="flex min-h-screen bg-[#1c1917]">
      {isAdminLoggedIn && !isPortalView && (
        <Sidebar onLogout={handleLogout} />
      )}

      <main className={`flex-1 overflow-y-auto ${isAdminLoggedIn && !isPortalView ? 'ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<CustomerPortal onAdminLogin={handleAdminLogin} />} />
          <Route 
            path="/dashboard" 
            element={isAdminLoggedIn ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/vouchers" 
            element={isAdminLoggedIn ? <VoucherManager /> : <Navigate to="/" />} 
          />
          <Route 
            path="/customers" 
            element={isAdminLoggedIn ? <CustomerDatabase /> : <Navigate to="/" />} 
          />
          <Route 
            path="/router" 
            element={isAdminLoggedIn ? <RouterControl /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {isAdminLoggedIn && !isPortalView && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 bg-[#451a03] border border-white/10 rounded-full shadow-2xl z-50">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-[10px] font-black text-[#d6d3d1] tracking-widest uppercase">Management Active</span>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;