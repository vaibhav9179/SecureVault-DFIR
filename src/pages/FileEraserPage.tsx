import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimulationBanner } from '../components/common/SimulationBanner';
import {
  FileX,
  Search,
  CheckSquare,
  Square,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  FileText,
  RotateCcw,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

export const FileEraserPage: React.FC = () => {
  const { erasableFiles, deleteFiles, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(['ERASE-001', 'ERASE-002']);
  const [method, setMethod] = useState('DoD 5220.22-M (3 Passes)');
  const [metadataCleanup, setMetadataCleanup] = useState(true);
  const [verificationEnabled, setVerificationEnabled] = useState(true);

  // Simulation process states
  const [confirmModal, setConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileScrubbing, setCurrentFileScrubbing] = useState('');
  const [completed, setCompleted] = useState(false);
  const [lastDeletedCount, setLastDeletedCount] = useState(0);

  const filteredFiles = erasableFiles.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFiles.map(f => f.id));
    }
  };

  // Selected files metrics
  const selectedFiles = erasableFiles.filter(f => selectedIds.includes(f.id));
  const totalSizeBytes = selectedFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleStartDelete = () => {
    setConfirmModal(false);
    setIsDeleting(true);
    setProgress(0);
    setLastDeletedCount(selectedIds.length);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const pct = Math.min(100, step * 20);
      setProgress(pct);

      const fileIndex = Math.min(selectedFiles.length - 1, Math.floor((pct / 100) * selectedFiles.length));
      if (selectedFiles[fileIndex]) {
        setCurrentFileScrubbing(`Scrubbing LBA clusters for: ${selectedFiles[fileIndex].name}...`);
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDeleting(false);
          setCompleted(true);
          deleteFiles(selectedIds, method);
          setSelectedIds([]);
        }, 400);
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      <SimulationBanner
        message="Simulation Mode — No real file deletion will occur."
        subText="File system tables and inode clusters are simulated in temporary browser state."
        variant="amber"
      />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Secure File & Folder Shredder
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically overwrite individual files, clear MFT attribute slack, and scrub directory entries
        </p>
      </div>

      {isDeleting ? (
        /* Progress View */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-5 text-xs max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Executing Multi-Pass Cryptographic Shredding
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Method: {method} · Metadata Scrub: {metadataCleanup ? 'Active' : 'Off'}
            </p>
          </div>

          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 truncate max-w-md">{currentFileScrubbing}</span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px] font-mono text-left">
            Overwriting slack space with pseudorandom pattern generator (0xAA, 0x55, 0x00)...
          </div>
        </div>
      ) : completed ? (
        /* Completed View */
        <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-800/40 text-center space-y-5 text-xs max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Secure Erasure Completed & Verified
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lastDeletedCount} file(s) permanently shredded. Residual sector entropy verified at 0.00.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Applied Standard:</span>
              <span className="text-white">{method}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>MFT / Inode Metadata:</span>
              <span className="text-emerald-400">Scrubbed & Nullified</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Verification Result:</span>
              <span className="text-emerald-400">100% Zero-Entropy Passed</span>
            </div>
          </div>

          <button
            onClick={() => setCompleted(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Shred More Files</span>
          </button>
        </div>
      ) : (
        /* Standard View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Browser & Selection (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search file name or path..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 shrink-0"
                >
                  {selectedIds.length === filteredFiles.length && filteredFiles.length > 0 ? (
                    <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {selectedIds.length === filteredFiles.length && filteredFiles.length > 0
                      ? 'Deselect All'
                      : 'Select All'}
                  </span>
                </button>
              </div>

              {/* Files Table */}
              <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="w-10 px-3 py-2.5 text-center">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="px-3 py-2.5">File Name & Path</th>
                      <th className="px-3 py-2.5">Size</th>
                      <th className="px-3 py-2.5">Entropy</th>
                      <th className="px-3 py-2.5">Modified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredFiles.map(file => {
                      const isChecked = selectedIds.includes(file.id);
                      return (
                        <tr
                          key={file.id}
                          onClick={() => handleToggleSelect(file.id)}
                          className={`cursor-pointer transition-colors ${
                            isChecked ? 'bg-cyan-950/20' : 'hover:bg-slate-900/60'
                          }`}
                        >
                          <td className="px-3 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleToggleSelect(file.id)}
                              className="text-slate-400 hover:text-white"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-2.5">
                            <p className="font-semibold text-white">{file.name}</p>
                            <p className="font-mono text-[10px] text-slate-500 truncate max-w-xs sm:max-w-md">
                              {file.path}
                            </p>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-slate-300 tabular-nums">
                            {file.size}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-slate-400">
                            {file.entropy}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500">
                            {file.dateModified}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Configuration & Action Panel (Right 1 col) */}
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                Erasure Configuration
              </h2>

              {/* Deletion Method */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Overwriting Algorithm
                </label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="DoD 5220.22-M (3 Passes)">DoD 5220.22-M (3 Passes)</option>
                  <option value="NIST SP 800-88 Rev 1 (Clear)">NIST SP 800-88 Rev 1 (Clear)</option>
                  <option value="Gutmann Method (35 Passes)">Gutmann Method (35 Passes)</option>
                  <option value="US Army AR 380-19 (3 Passes)">US Army AR 380-19 (3 Passes)</option>
                </select>
              </div>

              {/* Metadata Cleanup Toggle */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={metadataCleanup}
                    onChange={e => setMetadataCleanup(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-white block">Metadata & Slack Scrubbing</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Zeroes NTFS $MFT entry attributes, cluster slack, and file timestamps.
                    </span>
                  </div>
                </label>
              </div>

              {/* Verification Toggle */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={verificationEnabled}
                    onChange={e => setVerificationEnabled(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-white block">Sector Read-Back Verification</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Checks that target sectors read strictly null (0x00 pattern).
                    </span>
                  </div>
                </label>
              </div>

              {/* Summary Box */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Files:</span>
                  <span className="text-white font-bold">{selectedIds.length}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Payload Size:</span>
                  <span className="text-cyan-300 font-bold">{formatBytes(totalSizeBytes)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Verification:</span>
                  <span className="text-emerald-400">
                    {verificationEnabled ? 'Enabled' : 'Bypassed'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setConfirmModal(true)}
                disabled={selectedIds.length === 0}
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Secure Delete ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setConfirmModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-xs space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Confirm Simulated File Shredding
                </h3>
              </div>

              <p className="text-slate-300 leading-relaxed">
                You are about to securely scrub <strong>{selectedIds.length}</strong> file(s) ({formatBytes(totalSizeBytes)}) using{' '}
                <strong>{method}</strong>.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartDelete}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Confirm & Shred
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
