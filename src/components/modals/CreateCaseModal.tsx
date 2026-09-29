import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { FolderPlus, Shield, User, AlertCircle } from 'lucide-react';
import { Case } from '../../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ isOpen, onClose }) => {
  const { addCase, user, cases } = useApp();

  const [title, setTitle] = useState('');
  const [targetSubject, setTargetSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Case['priority']>('High');
  const [leadInvestigator, setLeadInvestigator] = useState(user.name);

  const nextCaseId = `CASE-2026-${String(cases.length + 1).padStart(3, '0')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetSubject.trim()) return;

    addCase({
      title: title.trim(),
      priority,
      targetSubject: targetSubject.trim(),
      description: description.trim() || 'Initialized forensic inquiry file.',
      leadInvestigator: leadInvestigator.trim()
    });

    setTitle('');
    setTargetSubject('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Forensic Case"
      subtitle={`Chain-of-Custody Dossier Entry · Registry ID ${nextCaseId}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Case ID and Auto-Generated Notice */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-medium">Assigned Case ID:</span>
            <span className="font-mono font-bold text-cyan-300">{nextCaseId}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">NIST SP 800-86 Compliant</span>
        </div>

        {/* Title */}
        <div>
          <label className="block text-slate-300 font-medium mb-1">Case Title / Operation Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Operation DarkByte — Compromised Financial Gateway"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Target Subject / Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Target Subject / Host Device *</label>
            <input
              type="text"
              required
              placeholder="e.g. Core NAS Storage Cluster"
              value={targetSubject}
              onChange={e => setTargetSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Case['priority'])}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="Critical">Critical (Immediate Carving)</option>
              <option value="High">High (High Priority)</option>
              <option value="Medium">Medium (Standard Routine)</option>
              <option value="Low">Low (Archival / Background)</option>
            </select>
          </div>
        </div>

        {/* Lead Investigator */}
        <div>
          <label className="block text-slate-300 font-medium mb-1">Lead Examiner / Custodian</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              required
              value={leadInvestigator}
              onChange={e => setLeadInvestigator(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Description / Scope */}
        <div>
          <label className="block text-slate-300 font-medium mb-1">Investigation Scope & Preliminary Brief</label>
          <textarea
            rows={3}
            placeholder="Document preliminary indicators of compromise, acquisition parameters, or forensic scope..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Simulation note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Case metadata will be recorded in local audit trails with simulated digital signatures.</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors font-medium shadow-sm shadow-cyan-600/20"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Initialize Case Dossier</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
