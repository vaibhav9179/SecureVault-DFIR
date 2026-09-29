import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SimulationBanner } from '../components/common/SimulationBanner';
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  List,
  GitBranch
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const actionOptions = [
    'ALL',
    'Device Added',
    'Evidence Acquired',
    'Recovery Started',
    'Recovery Scan Started',
    'File Recovered',
    'Sanitization Started',
    'Sanitization Verified',
    'Report Generated',
    'Chain of Custody Updated'
  ];

  const caseOptions = ['ALL', 'CASE-2026-001', 'CASE-2026-002', 'CASE-2026-003', 'CASE-2026-004'];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.caseId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction =
      actionFilter === 'ALL' ? true : log.action.toLowerCase().includes(actionFilter.toLowerCase());

    const matchesCase = caseFilter === 'ALL' ? true : log.caseId === caseFilter;

    const matchesStatus =
      statusFilter === 'ALL' ? true : log.status.toUpperCase() === statusFilter;

    const matchesDate =
      dateFilter === 'ALL'
        ? true
        : dateFilter === 'TODAY'
        ? log.timestamp.includes('2026-09-26')
        : true;

    return matchesSearch && matchesAction && matchesCase && matchesStatus && matchesDate;
  });

  const handleCopyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast('Audit Hash Copied', 'Cryptographic log entry hash copied to clipboard.', 'info');
  };

  const handleExportLogs = () => {
    addToast(
      'Audit Ledger Exported',
      `${filteredLogs.length} immutable audit entries exported as signed CSV report.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <SimulationBanner
        message="Immutable Forensic Audit Trail"
        subText="All user actions, hash calculations, and device interactions are append-only logged to satisfy Federal Rule of Evidence 902(14)."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Forensic Audit Logs & Activity Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete chronological record of simulated device attachments, carvings, and sanitizations
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm shadow-cyan-600/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        {/* Top Search & View toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by action, user, device, or hash..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded ${
                viewMode === 'table'
                  ? 'bg-slate-800 text-cyan-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded ${
                viewMode === 'timeline'
                  ? 'bg-slate-800 text-cyan-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Timeline</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters (Date, Action, Case, Status) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">
              Date Filter
            </label>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today (2026-09-26)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">
              Action Type
            </label>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {actionOptions.map(act => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">
              Case Docket
            </label>
            <select
              value={caseFilter}
              onChange={e => setCaseFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {caseOptions.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">
              Event Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success Only</option>
              <option value="WARNING">Warning</option>
              <option value="FLAGGED">Flagged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Timestamp (UTC)</th>
                  <th className="px-4 py-3">Investigator / User</th>
                  <th className="px-4 py-3">Forensic Action</th>
                  <th className="px-4 py-3">Target Device</th>
                  <th className="px-4 py-3">Case ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Cryptographic Hash</th>
                  <th className="px-4 py-3">IP / Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                      {log.user}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-medium text-cyan-300">{log.action}</span>
                      {log.details && (
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{log.details}</p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-300 font-mono text-[11px] truncate max-w-[140px]">
                      {log.device}
                    </td>

                    <td className="px-4 py-3 font-mono text-cyan-400 font-bold whitespace-nowrap">
                      {log.caseId}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={log.status} size="sm" />
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{log.hash}</span>
                        <button
                          onClick={() => handleCopyHash(log.id, log.hash)}
                          className="text-slate-500 hover:text-cyan-400 p-0.5"
                          title="Copy hash"
                        >
                          {copiedId === log.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {log.ipSession}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {filteredLogs.map(log => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-900 shadow-sm" />
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{log.action}</span>
                      <StatusBadge status={log.status} size="sm" />
                    </div>
                    <span className="font-mono text-[11px] text-cyan-400">{log.timestamp}</span>
                  </div>

                  {log.details && <p className="text-slate-300 text-xs">{log.details}</p>}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    <div>
                      <span>Investigator:</span> <strong className="text-slate-200">{log.user}</strong>
                    </div>
                    <div>
                      <span>Device:</span> <span className="text-slate-300">{log.device}</span>
                    </div>
                    <div>
                      <span>Case:</span> <span className="text-cyan-400">{log.caseId}</span>
                    </div>
                    <div>
                      <span>Session:</span> <span className="text-slate-500">{log.ipSession}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
