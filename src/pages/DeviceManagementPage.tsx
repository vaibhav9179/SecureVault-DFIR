import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SimulationBanner } from '../components/common/SimulationBanner';
import { DeviceDetailModal } from '../components/modals/DeviceDetailModal';
import { Device } from '../types';
import {
  HardDrive,
  Search,
  Filter,
  Eye,
  Activity,
  Trash2,
  FileSearch,
  Plus,
  ShieldCheck,
  Grid,
  List,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const DeviceManagementPage: React.FC = () => {
  const { devices, setSelectedDevice, updateDeviceStatus, addDevice, addToast, addAuditLog } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [attachingModal, setAttachingModal] = useState(false);

  // New Device Form state
  const [newDevName, setNewDevName] = useState('');
  const [newDevType, setNewDevType] = useState<Device['type']>('USB');
  const [newDevCapacity, setNewDevCapacity] = useState('128 GB');
  const [newDevFs, setNewDevFs] = useState('NTFS');

  const filteredDevices = devices.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.fileSystem.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ? true : d.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAnalyze = (e: React.MouseEvent, device: Device) => {
    e.stopPropagation();
    addToast('Analysis Diagnostic Started', `Scanning S.M.A.R.T. registers on ${device.name}...`, 'info');
    setTimeout(() => {
      updateDeviceStatus(device.id, device.status, 'Verified SHA-256');
      addToast('Integrity Confirmed', `${device.name} verified: 0 bad sectors, write-block intact.`, 'success');
      addAuditLog('Device Analyzed', device.name, device.associatedCaseId || 'UNASSIGNED', 'S.M.A.R.T. & SHA-256 integrity passed.');
    }, 1000);
  };

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevName.trim()) return;

    addDevice({
      name: newDevName.trim(),
      model: `${newDevName.trim()} Forensic Edition`,
      serialNumber: `SECV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      type: newDevType,
      capacity: newDevCapacity,
      capacityBytes: 128000000000,
      fileSystem: newDevFs,
      status: 'Ready',
      lastScanned: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      hashStatus: 'Verified SHA-256',
      sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      md5: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      mountPoint: `/dev/sd${String.fromCharCode(102 + devices.length)}1 (Read-Only)`,
      writeBlockerActive: true,
      smartHealth: 'Good (100% Health)',
      temperature: '29°C',
      sectorSize: '512 bytes',
      totalSectors: 250000000,
      associatedCaseId: 'CASE-2026-001'
    });

    setNewDevName('');
    setAttachingModal(false);
  };

  return (
    <div className="space-y-6">
      <SimulationBanner
        message="Hardware Write-Blocker Emulation Active"
        subText="All attached storage devices are mounted read-only by default to prevent evidentiary contamination."
      />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Connected Storage & Evidence Devices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Physical drives, forensic disk images, and memory storage media under active examination
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAttachingModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm shadow-cyan-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Attach Evidence Device</span>
          </button>
        </div>
      </div>

      {/* Filters and View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by device name, serial number, or file system..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['ALL', 'READY', 'ACQUIRED', 'SANITIZED', 'SCANNING'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded ${
              viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded ${
              viewMode === 'cards' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Card View"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Device Name & Serial</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">File System</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Scanned</th>
                  <th className="px-4 py-3">Hash Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredDevices.map(device => (
                  <tr
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-400 group-hover:scale-105 transition-transform">
                          <HardDrive className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {device.name}
                          </p>
                          <p className="font-mono text-[10px] text-slate-400">{device.serialNumber}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-300">{device.type}</td>

                    <td className="px-4 py-3 font-mono font-semibold text-white tabular-nums">
                      {device.capacity}
                    </td>

                    <td className="px-4 py-3 font-mono text-cyan-300">{device.fileSystem}</td>

                    <td className="px-4 py-3">
                      <StatusBadge status={device.status} />
                    </td>

                    <td className="px-4 py-3 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                      {device.lastScanned.split(' ')[0]}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{device.hashStatus}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDevice(device)}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                          title="View Device Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => handleAnalyze(e, device)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 rounded hover:bg-slate-800"
                          title="Run Quick Diagnostic"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/drive-eraser?deviceId=${device.id}`)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                          title="Secure Drive Erase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/recovery?deviceId=${device.id}`)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800"
                          title="Forensic Recovery"
                        >
                          <FileSearch className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map(device => (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <StatusBadge status={device.status} />
                </div>

                <h3 className="font-semibold text-white mt-3 text-sm group-hover:text-cyan-300 transition-colors">
                  {device.name}
                </h3>
                <p className="font-mono text-[10px] text-slate-400 mt-0.5">{device.serialNumber}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-400">Capacity:</span>
                    <p className="font-mono font-semibold text-white">{device.capacity}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">File System:</span>
                    <p className="font-mono text-cyan-300">{device.fileSystem}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Write-Block:</span>
                    <p className="text-emerald-400 font-mono">
                      {device.writeBlockerActive ? 'ACTIVE' : 'OFF'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">S.M.A.R.T:</span>
                    <p className="text-slate-300 font-medium truncate">{device.smartHealth.split(' ')[0]}</p>
                  </div>
                </div>
              </div>

              <div
                className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedDevice(device)}
                  className="text-xs text-slate-300 hover:text-white font-medium"
                >
                  View Details
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={e => handleAnalyze(e, device)}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-medium"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => navigate(`/drive-eraser?deviceId=${device.id}`)}
                    className="px-2 py-1 rounded bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40 text-xs font-medium"
                  >
                    Erase
                  </button>
                  <button
                    onClick={() => navigate(`/recovery?deviceId=${device.id}`)}
                    className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
                  >
                    Recover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attach Evidence Device Modal */}
      {attachingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setAttachingModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white tracking-tight">
                Attach New Evidence Storage Device
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate mounting secondary physical media into the forensic isolation sandbox.
              </p>

              <form onSubmit={handleAddDeviceSubmit} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Device Label / Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Corsair Flash Voyager GTX"
                    value={newDevName}
                    onChange={e => setNewDevName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Device Type</label>
                    <select
                      value={newDevType}
                      onChange={e => setNewDevType(e.target.value as Device['type'])}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="USB">USB Flash Drive</option>
                      <option value="HDD">External HDD</option>
                      <option value="SSD">SATA SSD</option>
                      <option value="NVMe">NVMe PCIe SSD</option>
                      <option value="SD Card">SD / MicroSD Card</option>
                      <option value="Forensic Image">Forensic Image (.E01)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Capacity</label>
                    <select
                      value={newDevCapacity}
                      onChange={e => setNewDevCapacity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="32 GB">32 GB</option>
                      <option value="64 GB">64 GB</option>
                      <option value="128 GB">128 GB</option>
                      <option value="512 GB">512 GB</option>
                      <option value="1.0 TB">1.0 TB</option>
                      <option value="2.0 TB">2.0 TB</option>
                      <option value="4.0 TB">4.0 TB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Detected File System</label>
                  <select
                    value={newDevFs}
                    onChange={e => setNewDevFs(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="NTFS">NTFS (Windows Default)</option>
                    <option value="exFAT">exFAT (Removable Media)</option>
                    <option value="FAT32">FAT32 (Legacy Storage)</option>
                    <option value="EXT4">EXT4 (Linux Forensic Image)</option>
                    <option value="APFS">APFS (Apple File System)</option>
                  </select>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  Hardware Write-Blocker will automatically engage upon attachment.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAttachingModal(false)}
                    className="px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
                  >
                    Mount Device
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Device Detail Modal */}
      <DeviceDetailModal />
    </div>
  );
};
