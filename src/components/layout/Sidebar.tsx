import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  HardDrive,
  Trash2,
  FileX,
  FileSearch,
  CheckCircle2,
  FolderGit2,
  FileText,
  History,
  Settings,
  Shield,
  Lock,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout, activeScan, activeSanitization } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Devices', path: '/devices', icon: <HardDrive className="w-4 h-4" /> },
    {
      name: 'Secure Drive Eraser',
      path: '/drive-eraser',
      icon: <Trash2 className="w-4 h-4" />,
      activeBadge: activeSanitization.inProgress ? 'ACTIVE' : undefined
    },
    { name: 'File & Folder Eraser', path: '/file-eraser', icon: <FileX className="w-4 h-4" /> },
    {
      name: 'Forensic Recovery',
      path: '/recovery',
      icon: <FileSearch className="w-4 h-4" />,
      activeBadge: activeScan.inProgress ? 'SCANNING' : undefined
    },
    { name: 'Recovery Results', path: '/results', icon: <CheckCircle2 className="w-4 h-4" /> },
    { name: 'Cases & Evidence', path: '/cases', icon: <FolderGit2 className="w-4 h-4" /> },
    { name: 'Reports', path: '/reports', icon: <FileText className="w-4 h-4" /> },
    { name: 'Audit Logs', path: '/audit-logs', icon: <History className="w-4 h-4" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                SecureVault DFIR
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Cyber Forensics Platform
              </p>
            </div>
          </NavLink>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Enclave Tag */}
        <div className="px-5 py-2.5 bg-slate-900/50 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Air-Gapped Sandbox</span>
          </span>
          <span className="font-mono text-emerald-400 text-[10px] font-semibold">WRITE-BLOCK ON</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.activeBadge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  {item.activeBadge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/30">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0">
                {user.avatarInitials}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{user.badgeId}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
