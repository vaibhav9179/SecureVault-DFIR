import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { SimulationBanner } from '../components/common/SimulationBanner';
import { CreateCaseModal } from '../components/modals/CreateCaseModal';
import { DeviceDetailModal } from '../components/modals/DeviceDetailModal';
import {
  HardDrive,
  FolderGit2,
  FileSearch,
  CheckCircle2,
  Trash2,
  FileX,
  Plus,
  ArrowRight,
  Shield,
  Activity,
  ShieldCheck,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    devices,
    cases,
    recoveredFiles,
    auditLogs,
    setSelectedDevice,
    activeScan,
    activeSanitization
  } = useApp();
  const navigate = useNavigate();
  const [createCaseModalOpen, setCreateCaseModalOpen] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  const workflowSteps = [
    {
      title: 'Acquire',
      desc: 'Bitstream disk image via hardware write-blocker (.E01 / .RAW)',
      icon: <HardDrive className="w-4 h-4" />,
      actionText: 'View Devices',
      route: '/devices'
    },
    {
      title: 'Analyze',
      desc: 'Parse file systems ($MFT, FAT, EXT4) and calculate SHA-256 hashes',
      icon: <Activity className="w-4 h-4" />,
      actionText: 'Inspect Evidence',
      route: '/cases'
    },
    {
      title: 'Erase / Recover',
      desc: 'Deep cluster carving or NIST SP 800-88 purge sanitization',
      icon: <Layers className="w-4 h-4" />,
      actionText: 'Launch Recovery',
      route: '/recovery'
    },
    {
      title: 'Verify',
      desc: 'Cryptographic hash verification & zero-entropy validation',
      icon: <ShieldCheck className="w-4 h-4" />,
      actionText: 'Audit Results',
      route: '/results'
    },
    {
      title: 'Report',
      desc: 'Export signed forensic reports & sanitization certificates',
      icon: <FileCheck className="w-4 h-4" />,
      actionText: 'View Reports',
      route: '/reports'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <SimulationBanner
        message="Simulation Mode — Safe Cyber Forensics & Sanitization Sandbox"
        subText="Operating with virtual hardware write-blockers. All drive operations and forensic carving are simulations."
      />

      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Forensic Command Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure Data Sanitization & Digital Forensic Recovery Management System
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/drive-eraser')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Secure Drive Erase</span>
          </button>

          <button
            onClick={() => navigate('/file-eraser')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors"
          >
            <FileX className="w-3.5 h-3.5 text-amber-400" />
            <span>File Erase</span>
          </button>

          <button
            onClick={() => navigate('/recovery')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors"
          >
            <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Start Recovery</span>
          </button>

          <button
            onClick={() => setCreateCaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm shadow-cyan-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Case</span>
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards (Exactly as requested) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          label="Total Devices"
          value={12}
          subValue="6 connected · 6 offline"
          icon={<HardDrive className="w-5 h-5 text-cyan-400" />}
          highlightColor="cyan"
        />

        <StatCard
          label="Active Cases"
          value={8}
          subValue="4 high priority"
          icon={<FolderGit2 className="w-5 h-5 text-indigo-400" />}
          highlightColor="indigo"
        />

        <StatCard
          label="Recovered Files"
          value="1,248"
          subValue="94.2% high confidence"
          icon={<FileSearch className="w-5 h-5 text-emerald-400" />}
          highlightColor="emerald"
        />

        <StatCard
          label="Sanitized Devices"
          value={24}
          subValue="NIST SP 800-88 certified"
          icon={<CheckCircle2 className="w-5 h-5 text-blue-400" />}
          highlightColor="blue"
        />

        <StatCard
          label="Verification Rate"
          value="100%"
          subValue="Zero hash divergence"
          trend={{ value: 'Target: 100%', positive: true }}
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
          highlightColor="cyan"
        />
      </div>

      {/* Workflow Visualization: Acquire → Analyze → Erase/Recover → Verify → Report */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              DFIR Operational Pipeline
            </h2>
            <p className="text-xs text-slate-400">
              ISO/IEC 27037 Standard Digital Evidence Handling Workflow
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Phase {activeWorkflowStep + 1} of 5 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
          {workflowSteps.map((step, idx) => {
            const isCurrent = idx === activeWorkflowStep;
            return (
              <div
                key={step.title}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`cursor-pointer p-3.5 rounded-lg border transition-all text-left relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                    <div
                      className={`p-1 rounded ${
                        isCurrent ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <h3
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-cyan-300' : 'text-slate-200'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigate(step.route);
                    }}
                    className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>{step.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  {idx < 4 && (
                    <ArrowRight className="hidden md:block w-3 h-3 text-slate-600 -mr-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Jobs Section if running */}
      {(activeScan.inProgress || activeSanitization.inProgress) && (
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
              Active System Processing Jobs
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Real-Time Job Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {activeScan.inProgress && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-slate-300 mb-1.5">
                  <span className="font-semibold">Forensic Sector Carving</span>
                  <span className="font-mono text-cyan-400">{activeScan.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${activeScan.progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">
                  {activeScan.currentLog}
                </p>
              </div>
            )}

            {activeSanitization.inProgress && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-slate-300 mb-1.5">
                  <span className="font-semibold">NIST Media Sanitization</span>
                  <span className="font-mono text-amber-400">{activeSanitization.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${activeSanitization.progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Phase: {activeSanitization.phase.toUpperCase()} · Standard: {activeSanitization.method}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Two Column Layout: Connected Devices & Recent Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Devices Overview */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                  Connected Evidence Devices
                </h3>
                <p className="text-[11px] text-slate-400">Active storage media mounted in read-only sandbox</p>
              </div>
              <button
                onClick={() => navigate('/devices')}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View All ({devices.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {devices.slice(0, 4).map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDevice(d)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-lg cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      <HardDrive className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-white truncate">{d.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {d.capacity} · {d.fileSystem} · {d.serialNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Hardware Write Blocker: <strong className="text-emerald-400">ENGAGED</strong></span>
            <button
              onClick={() => navigate('/drive-eraser')}
              className="text-slate-300 hover:text-white"
            >
              Launch Media Sanitizer →
            </button>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                  Active Forensic Cases
                </h3>
                <p className="text-[11px] text-slate-400">Assigned incident response files</p>
              </div>
              <button
                onClick={() => navigate('/cases')}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View All ({cases.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {cases.slice(0, 4).map(c => (
                <div
                  key={c.id}
                  onClick={() => navigate('/cases')}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-lg cursor-pointer transition-colors text-xs"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-300 font-bold">{c.id}</span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <p className="font-medium text-slate-200 truncate mt-0.5">{c.title}</p>
                    <p className="text-[11px] text-slate-400">{c.investigator} · {c.evidenceCount} devices</p>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {c.createdDate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Evidence Chain Integrity: <strong className="text-emerald-400">VERIFIED</strong></span>
            <button
              onClick={() => setCreateCaseModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              + Open New Docket
            </button>
          </div>
        </div>
      </div>

      {/* Recent Forensic Activity Log Stream */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">
              Recent Activity & Audit Trail
            </h3>
            <p className="text-[11px] text-slate-400">Immutable ledger of simulated forensic operations</p>
          </div>
          <button
            onClick={() => navigate('/audit-logs')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Full Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/60 mt-2">
          {auditLogs.slice(0, 5).map(log => (
            <div
              key={log.id}
              className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-400 shrink-0">
                  {log.timestamp.split(' ')[1]}
                </span>
                <span className="font-semibold text-slate-200">{log.action}</span>
                <span className="text-slate-400 text-[11px] truncate max-w-xs sm:max-w-md">
                  {log.device} · {log.caseId}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-[11px]">
                <span className="font-mono text-slate-400">{log.user}</span>
                <StatusBadge status={log.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateCaseModal
        isOpen={createCaseModalOpen}
        onClose={() => setCreateCaseModalOpen(false)}
      />
      <DeviceDetailModal />
    </div>
  );
};
