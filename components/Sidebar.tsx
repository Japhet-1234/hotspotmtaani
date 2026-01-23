
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, Settings, Zap, LogOut } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive 
        ? 'bg-[#451a03] text-[#d6d3d1] shadow-lg border border-[#78350f]/30' 
        : 'text-[#a8a29e] hover:bg-[#44403c] hover:text-[#d6d3d1]'
    }`;

  return (
    <div className="w-64 bg-[#1c1917] border-r border-[#44403c] h-screen flex flex-col p-4 fixed left-0 top-0 z-40">
      <div className="flex items-center gap-2 px-4 py-6 mb-8">
        <div className="p-2 bg-[#78350f] rounded-xl shadow-[0_0_15px_rgba(120,53,15,0.4)]">
          <Zap size={24} className="text-[#d6d3d1]" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-[#d6d3d1] italic leading-none">MTAANI</h1>
          <span className="text-[10px] text-[#78350f] font-bold tracking-widest uppercase">Management</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        <div className="text-[10px] text-[#44403c] font-bold uppercase tracking-widest px-4 mb-2">Network Control</div>
        <NavLink to="/dashboard" className={linkClasses}>
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Overview</span>
        </NavLink>
        <NavLink to="/vouchers" className={linkClasses}>
          <Ticket size={18} />
          <span className="text-sm font-medium">Vouchers</span>
        </NavLink>
        <NavLink to="/customers" className={linkClasses}>
          <Users size={18} />
          <span className="text-sm font-medium">Joined Customers</span>
        </NavLink>
        <NavLink to="/router" className={linkClasses}>
          <Settings size={18} />
          <span className="text-sm font-medium">Router Config</span>
        </NavLink>
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 bg-[#292524] rounded-2xl border border-[#44403c]">
          <div className="text-[9px] text-[#a8a29e] uppercase font-bold mb-2">Admin Profile</div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-[#44403c] border border-[#78350f]/30"></div>
             <span className="text-xs text-[#d6d3d1] font-bold">System Admin</span>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#451a03] text-[#d6d3d1] text-[10px] font-black uppercase rounded-lg hover:bg-[#78350f] transition-all"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
