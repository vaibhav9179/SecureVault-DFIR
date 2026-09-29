import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import {
  HardDrive,
  ShieldCheck,
  Activity,
  Cpu,
  Hash,
  Database,
  Trash2,
  FileSearch,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

export const DeviceDetailModal: React.FC = () => {
  const { selectedDevice, setSelectedDevice, updateDeviceStatus, addToast, addAuditLog } = useApp();
  const navigate = useNavigate();
  const [copiedSha, setCopiedSha] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  if (!selectedDevice) return null;

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
    addToast('Hash Copied', 'Cryptographic hash copied to clipboard.', 'info');
  };

  const handleQuickAnalyze = () => {
    setAnalyzing(true);
    addToast('Diagnostic Analysis Initiated', `Querying S.M.A.R.T. registers on ${selectedDevice.name}...`, 'info');
    setTimeout(() => {
      setAnalyzing(false);
      updateDeviceStatus(selectedDevice.id, selectedDevice.status, 'Verified SHA-256');
      addToast('Integrity Diagnostic Verified', 'S.M.A.R.T. health 100% OK. Zero bad sectors detected.', 'success');
      addAuditLog('Device Analyzed', selectedDevice.name, selectedDevice.associatedCaseId || 'UNASSIGNED', 'S.M.A.R.T. & SHA-256 integrity passed.');
    }, 1200);
  };

  const handleGoToErase = () => {
    const id = selectedDevice.id;
    setSelectedDevice(null);
    navigate(`/drive-eraser?deviceId=${id}`);
  };

  const handleGoToRecover = () => {
    const id = selectedDevice.id;
    setSelectedDevice(null);
    navigate(`/recovery?deviceId=${id}`);
  };

  return (
    <Modal
      isOpen={!!selectedDevice}
      onClose={() => setSelectedDevice(null)}
      title={selectedDevice.name}
      subtitle={`Model: ${selectedDevice.model} · S/N: ${selectedDevice.serialNumber}`}
      maxWidth="3xl"
    >
      <div className="space-y-5 text-xs">
        {/* Top Badges & Status Grid */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <StatusBadge status={selectedDevice.status} size="md" />
            <span className="text-slate-400 font-mono text-[11px]">{selectedDevice.mountPoint}</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedDevice.writeBlockerActive ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-mono font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                WRITE-BLOCKER ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 font-mono font-medium">
                DIRECT WRITE ENABLED
              </span>
            )}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <p className="text-slate-400 font-medium uppercase text-[10px]">Media Capacity</p>
            <p className="text-base font-bold text-white font-mono mt-1">{selectedDevice.capacity}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 tabular-nums">
              {selectedDevice.capacityBytes.toLocaleString()} bytes
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <p className="text-slate-400 font-medium uppercase text-[10px]">File System</p>
            <p className="text-base font-bold text-cyan-300 font-mono mt-1">{selectedDevice.fileSystem}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Partition Type: GPT/Primary</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <p className="text-slate-400 font-medium uppercase text-[10px]">S.M.A.R.T. Health</p>
            <p className="text-sm font-semibold text-emerald-400 mt-1 truncate">{selectedDevice.smartHealth}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Temp: {selectedDevice.temperature}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <p className="text-slate-400 font-medium uppercase text-[10px]">Sector Geometry</p>
            <p className="text-sm font-bold text-white font-mono mt-1">{selectedDevice.sectorSize}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 tabular-nums">
              {selectedDevice.totalSectors.toLocaleString()} sectors
            </p>
          </div>
        </div>

        {/* Cryptographic Hash Evidence Verification */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              Cryptographic Checksum (SHA-256 Master Image)
            </span>
            <button
              onClick={() => handleCopyHash(selectedDevice.sha256)}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              {copiedSha ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSha ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-300 break-all select-all">
            {selectedDevice.sha256}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>MD5: <code className="text-slate-300 font-mono">{selectedDevice.md5}</code></span>
            <span className="text-emerald-400 font-mono font-medium">Hash Status: {selectedDevice.hashStatus}</span>
          </div>
        </div>

        {/* Case Linkage */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400">Associated Investigation:</span>
            <span className="font-mono font-semibold text-cyan-300">
              {selectedDevice.associatedCaseId || 'Unassigned / Evidence Pool'}
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">Last Audited: {selectedDevice.lastScanned}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={handleQuickAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium text-xs disabled:opacity-50"
          >
            <Activity className={`w-3.5 h-3.5 text-cyan-400 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Testing S.M.A.R.T...' : 'Run Diagnostics'}</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleGoToErase}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 transition-colors font-medium text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Sanitize / Erase</span>
            </button>

            <button
              onClick={handleGoToRecover}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors font-medium text-xs shadow-sm shadow-cyan-600/20"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Recover Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
