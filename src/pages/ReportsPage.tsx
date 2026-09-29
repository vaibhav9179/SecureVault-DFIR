import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SimulationBanner } from '../components/common/SimulationBanner';
import { ReportViewModal } from '../components/modals/ReportViewModal';
import { Report } from '../types';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  ShieldCheck,
  Calendar,
  Award,
  Hash,
  Plus,
  FileCheck
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { reports, setSelectedReport, generateReport, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  // New report form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Report['type']>('Forensic Recovery Report');
  const [newCaseId, setNewCaseId] = useState('CASE-2026-001');
  const [newDevice, setNewDevice] = useState('WD My Passport Ultra HDD (2.0 TB)');
  const [newSummary, setNewSummary] = useState('');

  const reportTypes = [
    'ALL',
    'Forensic Recovery Report',
    'Secure Erasure Certificate',
    'Evidence Integrity Report',
    'Audit Report'
  ];

  const filteredReports = reports.filter(r => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' ? true : r.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleDownload = (e: React.MouseEvent, report: Report) => {
    e.stopPropagation();
    addToast(
      'Report PDF Downloaded',
      `Official dossier ${report.id}.pdf encrypted with examiner signature downloaded.`,
      'success'
    );
  };

  const handlePrint = (e: React.MouseEvent, report: Report) => {
    e.stopPropagation();
    setSelectedReport(report);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const rep = generateReport({
      title: newTitle.trim(),
      type: newType,
      caseId: newCaseId,
      deviceDetails: newDevice,
      summary:
        newSummary.trim() ||
        'Automated forensic examination and cryptographic validation executed under ISO/IEC 27037 protocol.'
    });

    setIsGenerateOpen(false);
    setNewTitle('');
    setNewSummary('');
    setSelectedReport(rep);
  };

  return (
    <div className="space-y-6">
      <SimulationBanner
        message="Simulation Mode — Generated Certificates and Reports"
        subText="All reports feature simulated ECDSA cryptographic seals and dual-hash NSRL checksum validations."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Reports & Sanitization Certificates
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Digitally certified forensic reports, NIST SP 800-88 erasure certificates, and audit dossiers
          </p>
        </div>

        <button
          onClick={() => setIsGenerateOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm shadow-cyan-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Compile New Report</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by report ID, title, or case number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {reportTypes.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                typeFilter === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {t === 'ALL' ? 'All Reports' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map(report => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between group shadow-sm text-xs"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    {report.id}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{report.caseId}</span>
                </div>
                <StatusBadge status={report.status} size="sm" />
              </div>

              {/* Title & Type */}
              <h3 className="font-bold text-white text-sm mt-3 group-hover:text-cyan-300 transition-colors leading-snug">
                {report.title}
              </h3>
              <p className="text-[11px] text-cyan-400 font-medium mt-0.5">{report.type}</p>

              {/* Device and Summary */}
              <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                {report.summary}
              </p>

              {/* Checksum and Date */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Author:</span>
                  <span className="text-slate-300">{report.author}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Generated:</span>
                  <span className="text-slate-300">{report.generatedDate}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SHA-256:</span>
                  <span className="text-cyan-400 truncate max-w-[180px]">
                    {report.sha256.substring(0, 16)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons: View, Download, Print */}
            <div
              className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedReport(report)}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Docket</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={e => handlePrint(e, report)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Print Report"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={e => handleDownload(e, report)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compile New Report Modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsGenerateOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-xs space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight">
                Compile Forensic Investigation Report
              </h3>
              <p className="text-slate-400 text-xs">
                Assemble evidence logs, hash records, and examiner credentials into an official docket.
              </p>

              <form onSubmit={handleGenerateSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Report Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Forensic Carving Audit — Operation DarkByte"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Report Classification</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as Report['type'])}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Forensic Recovery Report">Forensic Recovery Report</option>
                      <option value="Secure Erasure Certificate">Secure Erasure Certificate</option>
                      <option value="Evidence Integrity Report">Evidence Integrity Report</option>
                      <option value="Audit Report">Audit Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Case Docket</label>
                    <select
                      value={newCaseId}
                      onChange={e => setNewCaseId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="CASE-2026-001">CASE-2026-001</option>
                      <option value="CASE-2026-002">CASE-2026-002</option>
                      <option value="CASE-2026-003">CASE-2026-003</option>
                      <option value="CASE-2026-004">CASE-2026-004</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Examined Device / Scope</label>
                  <input
                    type="text"
                    required
                    value={newDevice}
                    onChange={e => setNewDevice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Forensic Findings Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Document evidentiary conclusions, file carving outcomes, or sanitization results..."
                    value={newSummary}
                    onChange={e => setNewSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsGenerateOpen(false)}
                    className="px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
                  >
                    Generate & Sign Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Report View Modal */}
      <ReportViewModal />
    </div>
  );
};
