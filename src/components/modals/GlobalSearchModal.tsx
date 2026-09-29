import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, HardDrive, FolderGit2, FileText, FileSearch, ArrowRight, X } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, devices, cases, recoveredFiles, reports } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredDevices = devices.filter(
    d => d.name.toLowerCase().includes(q) || d.serialNumber.toLowerCase().includes(q)
  );

  const filteredCases = cases.filter(
    c => c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.targetSubject.toLowerCase().includes(q)
  );

  const filteredFiles = recoveredFiles.filter(
    f => f.name.toLowerCase().includes(q) || f.sha256.toLowerCase().includes(q)
  );

  const filteredReports = reports.filter(
    r => r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)
  );

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 text-center">
        <div className="relative transform overflow-hidden rounded-xl bg-slate-900 border border-slate-800 text-left shadow-2xl transition-all w-full max-w-2xl">
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by device serial, case ID, evidence hash, file name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Quick Links if empty */}
            {!query && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelect('/drive-eraser')}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-left transition-colors"
                  >
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span>Secure Drive Eraser</span>
                  </button>
                  <button
                    onClick={() => handleSelect('/recovery')}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-left transition-colors"
                  >
                    <FileSearch className="w-4 h-4 text-cyan-400" />
                    <span>Forensic Recovery</span>
                  </button>
                  <button
                    onClick={() => handleSelect('/cases')}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-left transition-colors"
                  >
                    <FolderGit2 className="w-4 h-4 text-cyan-400" />
                    <span>Active Cases</span>
                  </button>
                  <button
                    onClick={() => handleSelect('/reports')}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-left transition-colors"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Reports & Certificates</span>
                  </button>
                </div>
              </div>
            )}

            {/* Devices */}
            {filteredDevices.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Devices ({filteredDevices.length})
                </p>
                <div className="space-y-1">
                  {filteredDevices.map(d => (
                    <button
                      key={d.id}
                      onClick={() => handleSelect('/devices')}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-left text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-medium truncate">{d.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">({d.capacity})</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cases */}
            {filteredCases.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Cases ({filteredCases.length})
                </p>
                <div className="space-y-1">
                  {filteredCases.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect('/cases')}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-left text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FolderGit2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="font-mono text-cyan-300 font-semibold">{c.id}</span>
                        <span className="truncate">{c.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recovered Files */}
            {filteredFiles.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Recovered Files ({filteredFiles.length})
                </p>
                <div className="space-y-1">
                  {filteredFiles.map(f => (
                    <button
                      key={f.id}
                      onClick={() => handleSelect('/results')}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-left text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileSearch className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-medium truncate">{f.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">({f.size})</span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400">{f.confidence}% Conf</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reports */}
            {filteredReports.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Reports ({filteredReports.length})
                </p>
                <div className="space-y-1">
                  {filteredReports.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleSelect('/reports')}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-left text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-mono text-cyan-300 font-semibold">{r.id}</span>
                        <span className="truncate">{r.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query &&
              filteredDevices.length === 0 &&
              filteredCases.length === 0 &&
              filteredFiles.length === 0 &&
              filteredReports.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p>No matching evidence, cases, or devices found.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Try searching by full SHA-256 hash, Case ID (e.g. CASE-2026-001), or file extension.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
