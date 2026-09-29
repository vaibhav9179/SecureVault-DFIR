import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SimulationBanner } from '../components/common/SimulationBanner';
import { SanitizationMethod } from '../types';
import {
  Trash2,
  HardDrive,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  RotateCcw,
  Activity,
  Layers,
  Award,
  Download,
  Eye,
  ArrowRight
} from 'lucide-react';

export const DriveEraserPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    devices,
    activeSanitization,
    startSanitization,
    resetSanitization,
    setSelectedReport,
    reports
  } = useApp();

  const paramDeviceId = searchParams.get('deviceId');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    paramDeviceId || (devices[0] ? devices[0].id : '')
  );

  const [method, setMethod] = useState<SanitizationMethod>('Purge');
  const [verifyOption, setVerifyOption] = useState<boolean>(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [confirmInput, setConfirmInput] = useState<string>('');

  useEffect(() => {
    if (paramDeviceId && devices.some(d => d.id === paramDeviceId)) {
      setSelectedDeviceId(paramDeviceId);
    }
  }, [paramDeviceId, devices]);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  const handleStartClick = () => {
    setConfirmInput('');
    setConfirmModalOpen(true);
  };

  const handleConfirmStart = () => {
    setConfirmModalOpen(false);
    if (selectedDevice) {
      startSanitization(selectedDevice.id, method, verifyOption);
    }
  };

  const handleViewCertificate = () => {
    if (activeSanitization.certificate) {
      const matchReport = reports.find(
        r => r.certificateData?.certificateId === activeSanitization.certificate?.certificateId
      );
      if (matchReport) {
        setSelectedReport(matchReport);
      } else {
        navigate('/reports');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <SimulationBanner
        message="Simulation Mode — No real device will be modified."
        subText="Sanitization algorithms execute in an emulated RAM enclave. No physical magnetic or flash media is altered."
        variant="amber"
      />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Secure Drive Sanitizer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          NIST SP 800-88 Rev 1 & DoD 5220.22-M Compliant Storage Media Overwrite Engine
        </p>
      </div>

      {/* Main Interactive Workflow Layout */}
      {!activeSanitization.inProgress && activeSanitization.phase !== 'completed' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Device Selection & Information */}
          <div className="lg:col-span-2 space-y-5">
            {/* Device Selector Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                Select Storage Media Target
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
                        <span
                          className={`font-mono ${
                            device.status === 'Sanitized' ? 'text-cyan-400' : 'text-emerald-400'
                          }`}
                        >
                          {device.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Device Deep Information */}
            {selectedDevice && (
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Hardware Specifications & Block Geometry
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Media Model</span>
                    <p className="font-mono text-xs font-semibold text-white mt-1 truncate">
                      {selectedDevice.model}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Interface Bus</span>
                    <p className="font-mono text-xs font-semibold text-cyan-300 mt-1">
                      {selectedDevice.type} / USB Bridge
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Logical Sector Size</span>
                    <p className="font-mono text-xs font-semibold text-white mt-1">
                      {selectedDevice.sectorSize}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Total LBAs</span>
                    <p className="font-mono text-xs font-semibold text-emerald-400 mt-1 tabular-nums">
                      {selectedDevice.totalSectors.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sanitization Parameters & Execution */}
          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Sanitization Method
              </h2>

              {/* Method Dropdown */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Overwriting Standard Protocol
                </label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value as SanitizationMethod)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  <option value="Clear">Clear (NIST SP 800-88 Rev 1 - Single Pass Zero Fill)</option>
                  <option value="Purge">Purge (DoD 5220.22-M 3-Pass - Zero, Ones, Random)</option>
                  <option value="Cryptographic Erase">
                    Cryptographic Erase (IEEE 1667 / ATA Crypto Scramble)
                  </option>
                  <option value="Gutmann 35-Pass">
                    Gutmann 35-Pass (High Security Defense Magnetic Spec)
                  </option>
                </select>

                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {method === 'Clear' &&
                    'Applies logical overwrite across all addressable storage sectors with fixed 0x00 bytes. Recommended for user-level data reuse.'}
                  {method === 'Purge' &&
                    'Three overwrite passes using complement byte sets (0x00, 0xFF) and pseudo-random entropy. Protects against laboratory forensic recovery.'}
                  {method === 'Cryptographic Erase' &&
                    'Zeroes internal hardware AES-XTS controller keys, rendering existing ciphertexts irreversibly unrecoverable within seconds.'}
                  {method === 'Gutmann 35-Pass' &&
                    'Maximum defense grade magnetic media overwrite with 35 passes of pseudo-random patterns.'}
                </p>
              </div>

              {/* Verification Option */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={verifyOption}
                    onChange={e => setVerifyOption(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-white text-xs block">
                      100% Full-Surface Verification
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Performs post-wipe read-back verification across all LBAs to confirm zero residual entropy (0.00).
                    </span>
                  </div>
                </label>
              </div>

              {/* Warning Panel */}
              <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-800/40 text-rose-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Irreversible Erasure Notice
                </div>
                <p className="text-[11px] text-rose-300/80 leading-relaxed">
                  Executing this operation would destroy all file systems, partition tables, and file remnants on a physical drive. In this prototype, execution is fully simulated.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStartClick}
                disabled={!selectedDevice}
                className="w-full py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Start Sanitization Workflow</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Progress Workflow or Completed State */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                {activeSanitization.phase === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Activity className="w-5 h-5 text-cyan-400 animate-spin" />
                )}
                {activeSanitization.phase === 'completed'
                  ? 'Sanitization & Verification Completed'
                  : 'Sanitization in Progress'}
              </h2>
              <p className="text-xs text-slate-400">
                Target: {selectedDevice?.name} ({selectedDevice?.capacity}) · Method: {activeSanitization.method}
              </p>
            </div>

            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
              Phase: {activeSanitization.phase.toUpperCase()}
            </span>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            {[
              { id: 'initializing', label: '1. Initializing' },
              { id: 'sanitizing', label: '2. Sanitizing' },
              { id: 'verifying', label: '3. Verification' },
              { id: 'completed', label: '4. Completed' }
            ].map(step => {
              const phases = ['initializing', 'sanitizing', 'verifying', 'completed'];
              const currentIdx = phases.indexOf(activeSanitization.phase);
              const stepIdx = phases.indexOf(step.id);
              const isDone = currentIdx >= stepIdx;
              const isCurrent = activeSanitization.phase === step.id;

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-lg border font-medium ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                      : isDone
                      ? 'bg-slate-950/80 border-emerald-800/40 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  {step.label}
                </div>
              );
            })}
          </div>

          {/* Large Animated Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Overwriting Blocks (Pass 1 of 3)</span>
              <span className="text-cyan-400 font-bold">{activeSanitization.progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  activeSanitization.phase === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${activeSanitization.progress}%` }}
              />
            </div>
          </div>

          {/* Sector Visualizer Grid Simulation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Logical Block Address (LBA) Heatmap</span>
              <span>Throughput: ~210 MB/s (Simulated)</span>
            </div>
            <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
              {Array.from({ length: 48 }).map((_, i) => {
                const filledCount = Math.floor((activeSanitization.progress / 100) * 48);
                const isZeroed = i < filledCount;
                return (
                  <div
                    key={i}
                    className={`h-3 rounded-xs transition-colors duration-150 ${
                      isZeroed
                        ? 'bg-cyan-400 shadow-xs shadow-cyan-400/50'
                        : 'bg-slate-800 border border-slate-700/40'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
              <span>LBA: 0x00000000</span>
              <span>LBA: 0x00E8D4A0</span>
              <span>Entropy: {activeSanitization.phase === 'completed' ? '0.000000' : '4.120912'}</span>
            </div>
          </div>

          {/* Certificate Generation Panel if completed */}
          {activeSanitization.phase === 'completed' && activeSanitization.certificate && (
            <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Sanitization Certificate Generated</span>
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  {activeSanitization.certificate.certificateId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 text-xs">
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Standard Applied</span>
                  <p className="font-semibold text-white mt-0.5">
                    {activeSanitization.certificate.standard}
                  </p>
                </div>
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Verification Result</span>
                  <p className="font-semibold text-emerald-300 mt-0.5">
                    {activeSanitization.certificate.verificationResult}
                  </p>
                </div>
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Cryptographic Signature</span>
                  <p className="font-mono text-[10px] text-cyan-300 mt-0.5 truncate">
                    {activeSanitization.certificate.digitalSignature}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={resetSanitization}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sanitize Another Drive</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleViewCertificate}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Official Certificate</span>
                  </button>

                  <button
                    onClick={() => navigate('/reports')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Reports Archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setConfirmModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-xs space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/40">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Confirm Drive Sanitization
                  </h3>
                  <p className="text-[11px] text-slate-400">Security Clearance Authorization Required</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-slate-300">
                  Target: <strong className="text-white">{selectedDevice?.name}</strong> ({selectedDevice?.capacity})
                </p>
                <p className="text-slate-400">
                  Standard: <span className="text-cyan-300 font-mono">{method}</span>
                </p>
                <p className="text-slate-400">
                  Verification: <span className="text-emerald-400">{verifyOption ? '100% Full Surface' : 'Off'}</span>
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Type <span className="font-mono text-rose-400 font-bold">SANITIZE</span> to confirm simulation:
                </label>
                <input
                  type="text"
                  placeholder="SANITIZE"
                  value={confirmInput}
                  onChange={e => setConfirmInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={confirmInput.trim().toUpperCase() !== 'SANITIZE'}
                  onClick={handleConfirmStart}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold transition-colors shadow-sm shadow-rose-600/20"
                >
                  Execute Sanitization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
