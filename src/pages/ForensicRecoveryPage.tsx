import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SimulationBanner } from '../components/common/SimulationBanner';
import {
  FileSearch,
  HardDrive,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  FileCheck,
  RotateCcw,
  ArrowRight,
  Database,
  Cpu,
  FileQuestion,
  FileX
} from 'lucide-react';

export const ForensicRecoveryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { devices, activeScan, startForensicScan, resetForensicScan } = useApp();

  const paramDeviceId = searchParams.get('deviceId');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    paramDeviceId || (devices[0] ? devices[0].id : '')
  );
  const [scanType, setScanType] = useState('Deep Scan');

  useEffect(() => {
    if (paramDeviceId && devices.some(d => d.id === paramDeviceId)) {
      setSelectedDeviceId(paramDeviceId);
    }
  }, [paramDeviceId, devices]);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  const handleStartScan = () => {
    if (selectedDevice) {
      startForensicScan(selectedDevice.id, scanType);
    }
  };

  return (
    <div className="space-y-6">
      <SimulationBanner
        message="Simulation Mode — No original evidence will be modified."
        subText="Hardware write-blocker ensures bit-level read-only access. All cluster carving is performed on simulated RAM buffers."
      />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Digital Forensic Recovery Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Raw Cluster File Carving, Master File Table ($MFT) Extraction, and Fragment Re-assembly
        </p>
      </div>

      {!activeScan.inProgress && !activeScan.completed ? (
        /* Configuration View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Device and Evidence Target */}
          <div className="lg:col-span-2 space-y-5 text-xs">
            {/* Device Selector */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                Select Storage Media / Image to Carve
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {devices.map(device => {
                  const isSelected = device.id === selectedDeviceId;
                  return (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDeviceId(device.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 shadow-sm shadow-cyan-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-white">{device.name}</span>
                        <span className="font-mono text-cyan-400 font-bold">{device.capacity}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">
                        S/N: {device.serialNumber}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                        <span>{device.fileSystem}</span>
                        <span className="text-emerald-400 font-mono">Write-Blocked</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evidence & Acquisition Dossier */}
            {selectedDevice && (
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Target Evidence Metadata & Acquisition Status
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Evidence ID</span>
                    <p className="font-mono text-xs font-bold text-cyan-300 mt-1">
                      {selectedDevice.associatedCaseId
                        ? `EVD-${selectedDevice.associatedCaseId.replace('CASE-', '')}-A`
                        : 'EVD-2026-001-A'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Acquisition Status</span>
                    <p className="font-mono text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>E01 Bitstream</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">File System</span>
                    <p className="font-mono text-xs font-semibold text-white mt-1">
                      {selectedDevice.fileSystem}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Total LBAs</span>
                    <p className="font-mono text-xs font-semibold text-white mt-1 tabular-nums">
                      {selectedDevice.totalSectors.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <span>SHA-256 Checksum:</span>
                  <span className="text-cyan-400 truncate max-w-xs">{selectedDevice.sha256}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Scan Type Selection & Trigger */}
          <div className="space-y-5 text-xs">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Forensic Carving Algorithm
              </h2>

              {/* Scan Types */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'Quick Scan',
                    name: 'Quick Scan (Index Parsing)',
                    desc: 'Fast analysis of Master File Table ($MFT) and deleted directory entry pointers.'
                  },
                  {
                    id: 'Deep Scan',
                    name: 'Deep Scan (Raw Cluster Carving)',
                    desc: 'Sector-by-sector scan through unallocated clusters for known header & footer patterns.'
                  },
                  {
                    id: 'Signature Scan',
                    name: 'Signature Scan (Magic Bytes)',
                    desc: 'Identifies file magic bytes (PDF, JPEG, ZIP, SQLite, MP4) ignoring corrupted file tables.'
                  },
                  {
                    id: 'Fragment Recovery',
                    name: 'Fragment Recovery (Multimedia)',
                    desc: 'Smart heuristic reconstruction of non-contiguous fragments for fragmented video & archives.'
                  }
                ].map(opt => {
                  const isSelected = scanType === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setScanType(opt.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{opt.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Start Scan Button */}
              <button
                onClick={handleStartScan}
                disabled={!selectedDevice}
                className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50"
              >
                <FileSearch className="w-4 h-4" />
                <span>Start Forensic Scan</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Animated Progress and Real-Time Telemetry Display */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          {/* Top Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                {activeScan.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Activity className="w-5 h-5 text-cyan-400 animate-spin" />
                )}
                {activeScan.completed ? 'Forensic Scan Complete' : 'Carving Clusters in Progress'}
              </h2>
              <p className="text-xs text-slate-400">
                Target: {selectedDevice?.name} ({selectedDevice?.capacity}) · Method: {activeScan.scanType}
              </p>
            </div>

            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
              Throughput: ~184 MB/s (Simulated)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                Sectors Scanned: {activeScan.sectorsScanned.toLocaleString()} / {activeScan.totalSectors.toLocaleString()}
              </span>
              <span className="text-cyan-400 font-bold">{activeScan.progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  activeScan.completed ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${activeScan.progress}%` }}
              />
            </div>
          </div>

          {/* Real-time Metric Counters (Required: Sectors scanned, Files discovered, Deleted files, Fragmented files, Corrupted files) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">
                Sectors Scanned
              </span>
              <p className="text-sm sm:text-base font-bold text-white font-mono mt-1 tabular-nums">
                {activeScan.sectorsScanned.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">
                Files Discovered
              </span>
              <p className="text-sm sm:text-base font-bold text-cyan-400 font-mono mt-1 tabular-nums">
                {activeScan.filesDiscovered.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">
                Deleted Files
              </span>
              <p className="text-sm sm:text-base font-bold text-emerald-400 font-mono mt-1 tabular-nums">
                {activeScan.deletedFiles.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">
                Fragmented Files
              </span>
              <p className="text-sm sm:text-base font-bold text-amber-400 font-mono mt-1 tabular-nums">
                {activeScan.fragmentedFiles.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">
                Corrupted Files
              </span>
              <p className="text-sm sm:text-base font-bold text-rose-400 font-mono mt-1 tabular-nums">
                {activeScan.corruptedFiles.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Live Scanner Log Stream Terminal */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-800">
              <span>FORENSIC CARVER LOG STREAM</span>
              <span className="text-emerald-400">CARVER ENGINE v3.4</span>
            </div>
            <p className="text-cyan-300">&gt; {activeScan.currentLog}</p>
            <p className="text-slate-400">&gt; NSRL RDS Hash Check: 1,120 matches against known non-malicious hashsets.</p>
            <p className="text-slate-400">&gt; Unallocated cluster carving: 0x004F1820 - 0x004F9000 verified.</p>
          </div>

          {/* Actions on Completion */}
          {activeScan.completed && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={resetForensicScan}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Run New Scan</span>
              </button>

              <button
                onClick={() => navigate('/results')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors shadow-lg shadow-cyan-600/20"
              >
                <FileCheck className="w-4 h-4" />
                <span>Explore 1,248 Recovered Files</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
