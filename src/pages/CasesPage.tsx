import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SimulationBanner } from '../components/common/SimulationBanner';
import { CreateCaseModal } from '../components/modals/CreateCaseModal';
import { Case, CaseEvidence, CustodyRecord } from '../types';
import {
  FolderGit2,
  Plus,
  Search,
  User,
  ShieldCheck,
  Calendar,
  Hash,
  FileText,
  FileCheck,
  Lock,
  Layers,
  ChevronRight,
  ExternalLink,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CasesPage: React.FC = () => {
  const { cases, generateReport, setSelectedReport, addToast } = useApp();
  const navigate = useNavigate();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0] ? cases[0].id : '');
  const [searchTerm, setSearchTerm] = useState('');

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const filteredCases = cases.filter(
    c =>
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.investigator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateCaseReport = (c: Case) => {
    const report = generateReport({
      title: `Final Case Investigation Report — ${c.id}`,
      type: 'Forensic Recovery Report',
      caseId: c.id,
      deviceDetails: `${c.evidenceList.map(e => e.deviceName).join(', ') || 'Forensic Acquisition Disk'}`,
      summary: `Comprehensive digital forensics dossier for ${c.title}. Subject: ${c.targetSubject}. All chain-of-custody transfers verified against ISO 27037 protocol.`
    });
    setSelectedReport(report);
  };

  return (
    <div className="space-y-6">
      <SimulationBanner
        message="Chain-of-Custody & Evidence Dossier Enclave"
        subText="All evidence transfers and examiner signatures are cryptographically recorded in compliance with NIST SP 800-86."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Forensic Cases & Evidence Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official digital investigation dockets, custodian ledger, and chain-of-custody tracking
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm shadow-cyan-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Case</span>
        </button>
      </div>

      {/* Layout: Left Case List, Right Selected Case Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cases List Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search case dossiers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            {filteredCases.map(c => {
              const isSelected = c.id === activeCase?.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-cyan-300">{c.id}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>

                  <h3 className="font-semibold text-white leading-snug line-clamp-1">{c.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    Target: {c.targetSubject}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                    <span>{c.investigator.split(' ').slice(-1)[0]}</span>
                    <span>{c.evidenceCount} Evidence Items</span>
                    <span>{c.createdDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Case Dossier (8 cols) */}
        {activeCase && (
          <div className="lg:col-span-8 space-y-6">
            {/* Top Case Overview Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      {activeCase.id}
                    </span>
                    <StatusBadge status={activeCase.status} size="md" />
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                      Priority: {activeCase.priority}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                    {activeCase.title}
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Target System: <strong className="text-slate-200">{activeCase.targetSubject}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleGenerateCaseReport(activeCase)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium shrink-0 transition-colors shadow-sm shadow-cyan-600/20"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Generate Final Report</span>
                </button>
              </div>

              {/* Case Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">
                    Lead Investigator
                  </span>
                  <p className="font-semibold text-white mt-1 truncate">{activeCase.investigator}</p>
                  <p className="text-[10px] text-slate-500 truncate">{activeCase.investigatorEmail}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">
                    Date Initialized
                  </span>
                  <p className="font-mono font-semibold text-white mt-1">{activeCase.createdDate}</p>
                  <p className="text-[10px] text-slate-500 font-mono">DOCKET OPENED</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">
                    Evidence Count
                  </span>
                  <p className="font-mono text-base font-bold text-cyan-400 mt-1">
                    {activeCase.evidenceList.length}
                  </p>
                  <p className="text-[10px] text-slate-500">Cataloged artifacts</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">
                    Integrity Status
                  </span>
                  <p className="text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Bit-Perfect</span>
                  </p>
                  <p className="text-[10px] text-slate-500">Dual-hash confirmed</p>
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Investigative Synopsis
                </span>
                <p className="text-slate-300 leading-relaxed text-xs">{activeCase.description}</p>
              </div>
            </div>

            {/* Attached Evidence Details Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Attached Physical & Digital Evidence ({activeCase.evidenceList.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-400">ISO 27037 Intake</span>
              </div>

              {activeCase.evidenceList.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No evidence attached yet.</p>
              ) : (
                <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="px-3 py-2.5">Evidence ID</th>
                        <th className="px-3 py-2.5">Device Target</th>
                        <th className="px-3 py-2.5">Acquisition Date</th>
                        <th className="px-3 py-2.5">SHA-256 Digest</th>
                        <th className="px-3 py-2.5">Custodian</th>
                        <th className="px-3 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {activeCase.evidenceList.map(ev => (
                        <tr key={ev.evidenceId} className="hover:bg-slate-900/60">
                          <td className="px-3 py-2.5 font-mono font-bold text-cyan-300">
                            {ev.evidenceId}
                          </td>
                          <td className="px-3 py-2.5 font-medium text-white">{ev.deviceName}</td>
                          <td className="px-3 py-2.5 font-mono text-slate-400 text-[11px]">
                            {ev.acquisitionDate}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-slate-400 truncate max-w-[130px]">
                            {ev.sha256.substring(0, 16)}...
                          </td>
                          <td className="px-3 py-2.5 text-slate-300">{ev.custodian}</td>
                          <td className="px-3 py-2.5">
                            <StatusBadge status={ev.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Chain of Custody Timeline Ledger */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Immutable Chain of Custody Ledger
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  AUDITED & SEALED
                </span>
              </div>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {activeCase.chainOfCustody.map((record, idx) => (
                  <div key={record.id} className="relative">
                    <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-900 shadow-sm" />
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-white">{record.action}</span>
                        <span className="font-mono text-[11px] text-slate-400">{record.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Custodian: <strong className="text-slate-200">{record.custodian}</strong> · Location:{' '}
                        <span className="text-slate-300">{record.location}</span>
                      </p>
                      <div className="pt-1.5 mt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Digital Signature:</span>
                        <span className="text-cyan-400">{record.digitalSignature}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Case Modal */}
      <CreateCaseModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
};
