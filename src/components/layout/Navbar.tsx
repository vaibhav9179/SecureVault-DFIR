import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Settings,
  ShieldAlert,
  HardDrive,
  FolderGit2,
  FileText,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onToggleMobile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobile }) => {
  const { user, setIsSearchOpen, activeScan, activeSanitization } = useApp();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifications = [
    {
      id: 'N1',
      title: 'Forensic Write-Block Verified',
      desc: 'Hardware bridge confirmed active on WD My Passport HDD (2.0 TB)',
      time: '5m ago',
      type: 'info'
    },
    {
      id: 'N2',
      title: 'Case CASE-2026-001 Updated',
      desc: 'Investigator T. Vance logged new chain-of-custody transfer entry',
      time: '24m ago',
      type: 'success'
    },
    {
      id: 'N3',
      title: 'Media Sanitization Certificate Ready',
      desc: 'Kingston DataTraveler 32GB zeroed according to NIST SP 800-88',
      time: '3h ago',
      type: 'info'
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Quick Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs w-48 sm:w-72 transition-all group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="truncate">Search devices, cases, files...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Status Pill, Notifications, Settings, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Live Job Indicator if active */}
        {activeScan.inProgress && (
          <Link
            to="/recovery"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Scan in Progress ({activeScan.progress}%)
          </Link>
        )}

        {activeSanitization.inProgress && (
          <Link
            to="/drive-eraser"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Wiping Drive ({activeSanitization.progress}%)
          </Link>
        )}

        {/* Simulation Mode Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 text-xs">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] font-medium text-slate-300">SIMULATION READY</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Notifications (3)
                  </h4>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-800/60 mt-2 space-y-2">
                  {notifications.map(n => (
                    <div key={n.id} className="pt-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Mark all read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings Link */}
        <Link
          to="/settings"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="System Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Profile Avatar / Quick Info */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-900 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono">
              {user.avatarInitials}
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{user.badgeId}</p>
            </div>
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="pb-3 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{user.email}</p>
                  <p className="text-[10px] text-cyan-400 font-mono mt-1">{user.role}</p>
                </div>
                <div className="py-2 space-y-1">
                  <Link
                    to="/cases"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-md"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>My Assigned Cases</span>
                  </Link>
                  <Link
                    to="/reports"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-md"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Signed Reports</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-md"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Lab Configuration</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
