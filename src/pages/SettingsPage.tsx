import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimulationBanner } from '../components/common/SimulationBanner';
import {
  Settings,
  Shield,
  User,
  Sliders,
  Database,
  Lock,
  RotateCcw,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, addToast } = useApp();

  const [writeBlockerPolicy, setWriteBlockerPolicy] = useState('ALWAYS_ENFORCE');
  const [defaultHash, setDefaultHash] = useState('SHA-256');
  const [autoVerifySectors, setAutoVerifySectors] = useState(true);
  const [entropyThreshold, setEntropyThreshold] = useState('0.00 (Zero Remnants)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    addToast('Configuration Updated', 'Forensic workstation parameters updated.', 'success');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetData = () => {
    addToast(
      'Prototype Reset',
      'Simulation environment restored to baseline state with default mock evidence.',
      'info'
    );
  };

  return (
    <div className="space-y-6">
      <SimulationBanner
        message="Laboratory Environment Configuration"
        subText="Settings dictate simulated write-blocking, cryptographic validation policies, and examiner credentials."
      />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          System Settings & Lab Policies
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Forensic workstation parameters, NIST SP 800-88 defaults, and examiner identification
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs max-w-4xl">
        {/* Examiner Credentials */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Active Forensic Examiner Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Examiner Full Name</label>
              <input
                type="text"
                disabled
                value={user.name}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Badge / Investigator ID</label>
              <input
                type="text"
                disabled
                value={user.badgeId}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Agency / Department</label>
              <input
                type="text"
                disabled
                value={user.agency}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Clearance Level</label>
              <input
                type="text"
                disabled
                value={user.clearanceLevel}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security & Write-Block Policies */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Evidence Preservation Policies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Hardware Write-Blocker Emulation</label>
              <select
                value={writeBlockerPolicy}
                onChange={e => setWriteBlockerPolicy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="ALWAYS_ENFORCE">Always Enforce (Read-Only Mount on All Devices)</option>
                <option value="WARN_ON_WRITE">Prompt for Confirmation Before Disabling</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Primary Integrity Checksum</label>
              <select
                value={defaultHash}
                onChange={e => setDefaultHash(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="SHA-256">SHA-256 (NIST Standard Recommended)</option>
                <option value="SHA-512">SHA-512 (High Entropy)</option>
                <option value="MD5 + SHA-256">Dual Hash (MD5 + SHA-256)</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoVerifySectors}
                onChange={e => setAutoVerifySectors(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-white block">Auto-Verify Sector Integrity</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Automatically compute and verify SHA-256 checksums before and after any analysis or carving job.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Default Prototype Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors shadow-sm shadow-cyan-600/20"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Sliders className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved' : 'Save Policies'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
