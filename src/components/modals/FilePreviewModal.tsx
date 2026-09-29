import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { RecoveredFile } from '../../types';
import {
  FileText,
  Hash,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  Binary,
  Layers,
  Calendar,
  Tag,
  Download
} from 'lucide-react';

export const FilePreviewModal: React.FC = () => {
  const { selectedFile, setSelectedFile, classifyFile, addToast, addAuditLog } = useApp();
  const [copied, setCopied] = useState(false);

  if (!selectedFile) return null;

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Checksum Copied', 'SHA-256 hash copied to clipboard.', 'info');
  };

  const handleExportSimulated = () => {
    addToast(
      'Artifact Exported',
      `${selectedFile.name} exported to secure forensic working directory /exports/case_${selectedFile.caseId}/`,
      'success'
    );
    addAuditLog('File Exported', selectedFile.name, selectedFile.caseId, `Exported artifact SHA-256: ${selectedFile.sha256}`);
  };

  return (
    <Modal
      isOpen={!!selectedFile}
      onClose={() => setSelectedFile(null)}
      title={selectedFile.name}
      subtitle={`Recovered Artifact · ID: ${selectedFile.id} · Associated with ${selectedFile.caseId}`}
      maxWidth="3xl"
    >
      <div className="space-y-4 text-xs">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-2">
            <StatusBadge status={selectedFile.status} size="md" />
            <span className="font-mono text-cyan-300 font-semibold text-[11px] bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              {selectedFile.confidence}% Confidence
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Classification:</span>
            <select
              value={selectedFile.classification}
              onChange={e =>
                classifyFile(selectedFile.id, e.target.value as RecoveredFile['classification'])
              }
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-medium focus:outline-none focus:border-cyan-500"
            >
              <option value="Evidence Tier 1">Evidence Tier 1 (Core Forensic)</option>
              <option value="High Relevance">High Relevance</option>
              <option value="Unclassified">Unclassified</option>
              <option value="Inconclusive">Inconclusive</option>
            </select>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-medium">Artifact Size</span>
            <p className="text-sm font-bold text-white font-mono mt-1">{selectedFile.size}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 tabular-nums">
              {selectedFile.sizeBytes.toLocaleString()} bytes
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-medium">Recovery Method</span>
            <p className="text-sm font-bold text-cyan-300 mt-1 truncate">{selectedFile.recoveryMethod}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Carving Algorithm</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-medium">Evidence Source</span>
            <p className="text-sm font-bold text-indigo-300 font-mono mt-1">{selectedFile.evidenceId}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Physical Device Link</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-medium">Carve Timestamp</span>
            <p className="text-xs font-semibold text-slate-200 font-mono mt-1 truncate">
              {selectedFile.recoveryTimestamp}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">UTC Normalized</p>
          </div>
        </div>

        {/* Original File System Location */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-medium">
            Original File System Path (Unallocated / MFT Record)
          </span>
          <p className="font-mono text-xs text-slate-200 mt-1 break-all bg-slate-900/60 p-2 rounded border border-slate-800/80">
            {selectedFile.originalLocation}
          </p>
        </div>

        {/* Cryptographic Hashes */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              Cryptographic Checksum (SHA-256)
            </span>
            <button
              onClick={() => handleCopyHash(selectedFile.sha256)}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-300 break-all select-all border border-slate-800/80">
            {selectedFile.sha256}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              MD5: <code className="text-slate-300 font-mono">{selectedFile.md5}</code>
            </span>
            <span className="text-emerald-400 font-mono">Matched against NSRL RDS DB</span>
          </div>
        </div>

        {/* Hex / Binary Header Preview */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 text-[10px] uppercase font-medium flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              Raw Magic Bytes Header Dump (First 32 Bytes)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Offset: 0x00000000</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-cyan-300/90 break-all tracking-wider leading-relaxed border border-slate-800/80">
            {selectedFile.hexSnippet}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic Chain of Custody Maintained</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleExportSimulated}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors shadow-sm shadow-cyan-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Recovered Artifact</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
