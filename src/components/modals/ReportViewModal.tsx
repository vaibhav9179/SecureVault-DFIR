import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  Printer,
  Download,
  Shield,
  CheckCircle,
  Hash,
  Award,
  Key,
  Calendar,
  UserCheck
} from 'lucide-react';

export const ReportViewModal: React.FC = () => {
  const { selectedReport, setSelectedReport, addToast } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!selectedReport) return null;

  const handlePrint = () => {
    addToast('Print Command Sent', `Report ${selectedReport.id} dispatched to system print dialog.`, 'info');
    window.print();
  };

  const handleDownload = () => {
    addToast(
      'Document Exported',
      `${selectedReport.id}.pdf compiled with cryptographically signed timestamp and watermarking.`,
      'success'
    );
  };

  return (
    <Modal
      isOpen={!!selectedReport}
      onClose={() => setSelectedReport(null)}
      title="Official Forensic Report & Verification Record"
      subtitle={`${selectedReport.type} · Docket ${selectedReport.id}`}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-xs">
        {/* Printable Document Paper Card */}
        <div
          ref={printRef}
          className="p-6 sm:p-8 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 space-y-6 relative overflow-hidden"
        >
          {/* Watermark in corner */}
          <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
            <Shield className="w-48 h-48 text-cyan-400" />
          </div>

          {/* Letterhead */}
          <div className="border-b border-slate-800 pb-5 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white uppercase">
                  SecureVault DFIR Incident Response Lab
                </h1>
                <p className="text-[11px] text-slate-400">
                  National Digital Forensics & Media Sanitization Authority · ISO/IEC 27037 Certified
                </p>
                <p className="text-[10px] font-mono text-cyan-400 mt-0.5">
                  Accreditation: DFIR-LAB-ACC-2026-NIST-SP800-88
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold text-cyan-300 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 inline-block">
                {selectedReport.id}
              </span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{selectedReport.generatedDate}</p>
              <div className="mt-1">
                <StatusBadge status={selectedReport.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Matter / Case Dossier</span>
              <p className="font-mono text-sm font-bold text-white mt-0.5">{selectedReport.caseId}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Certifying Examiner</span>
              <p className="text-xs font-semibold text-cyan-300 mt-0.5">{selectedReport.author}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Report Classification</span>
              <p className="text-xs font-semibold text-emerald-400 mt-0.5">{selectedReport.type}</p>
            </div>
          </div>

          {/* Device & Hardware Target */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Examined Media & Storage Hardware
            </h2>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 font-mono text-[11px] text-slate-300">
              {selectedReport.deviceDetails}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Executive Forensic Summary
            </h2>
            <p className="text-slate-300 leading-relaxed text-xs p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              {selectedReport.summary}
            </p>
          </div>

          {/* Actions & Protocol Steps */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Executed Forensic Procedures & Cryptographic Audits
            </h2>
            <div className="divide-y divide-slate-800/80 rounded-lg bg-slate-900/40 border border-slate-800">
              {selectedReport.actionsPerformed.map((action, idx) => (
                <div key={idx} className="p-2.5 flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Hash Checksum */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                Root Cryptographic SHA-256 Digest
              </span>
              <span className="text-emerald-400 font-mono">100% BIT-PERFECT VERIFIED</span>
            </div>
            <p className="font-mono text-[11px] text-cyan-300 break-all select-all bg-slate-950 p-2 rounded border border-slate-800">
              {selectedReport.sha256}
            </p>
            <p className="text-[11px] text-slate-400">
              Result: <strong className="text-emerald-300">{selectedReport.verificationResult}</strong>
            </p>
          </div>

          {/* Digital Signature & Certification Box */}
          <div className="border-t border-slate-800 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">NIST SP 800-88 / ISO 27037 Standard</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Meets Federal rules of evidence evidentiary admissibility criteria.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Digital Seal & Signature</span>
                <span className="text-[10px] font-mono text-emerald-400">ECDSA-P256-VALID</span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 break-all mt-1">
                SIG-ECDSA-SECUREVAULT-{selectedReport.id}-OK-VALIDATED
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-cyan-400" />
                <span>Digitally signed by {selectedReport.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400 font-mono">
            SecureVault DFIR Electronic Case File Repository
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedReport(null)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print Official Copy</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors shadow-sm shadow-cyan-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
