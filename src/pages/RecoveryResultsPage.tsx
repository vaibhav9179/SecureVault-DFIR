import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SimulationBanner } from '../components/common/SimulationBanner';
import { FilePreviewModal } from '../components/modals/FilePreviewModal';
import { RecoveredFile, FileCategory } from '../types';
import {
  FileSearch,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  Video,
  Archive,
  Database,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Grid,
  List,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const RecoveryResultsPage: React.FC = () => {
  const { recoveredFiles, setSelectedFile, classifyFile, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filters = [
    'All',
    'High Confidence',
    'Documents',
    'Images',
    'Videos',
    'Archives',
    'Databases',
    'Corrupted'
  ];

  const filteredFiles = recoveredFiles.filter(file => {
    // Search match
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.sha256.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.originalLocation.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Category / Status Filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'High Confidence') return file.confidence >= 90;
    if (activeFilter === 'Corrupted') return file.status === 'Corrupted' || file.status === 'Fragmented';
    return file.category === activeFilter;
  });

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'Documents':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'Images':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'Videos':
        return <Video className="w-4 h-4 text-amber-400" />;
      case 'Archives':
        return <Archive className="w-4 h-4 text-indigo-400" />;
      case 'Databases':
        return <Database className="w-4 h-4 text-rose-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleExportAll = () => {
    addToast(
      'Export Bundle Created',
      `Compressed archive containing ${filteredFiles.length} recovered artifacts generated at /exports/DFIR_Bundle.tar.gz`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <SimulationBanner
        message="Simulation Mode — Recovered Artifacts Read From Forensic Clone"
        subText="Master evidence remains write-blocked. Artifacts cataloged and verified with cryptographic checksums."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Forensic Carving Results & File Classification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing carved files from unallocated clusters and recovered file records
          </p>
        </div>

        <button
          onClick={handleExportAll}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm shadow-cyan-600/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Artifacts ({filteredFiles.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by file name, SHA-256 hash, or file system path..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* View Toggle */}
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

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Results Content */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Original Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">SHA-256 Digest</th>
                  <th className="px-4 py-3">Classification</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredFiles.map(file => (
                  <tr
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                          {getCategoryIcon(file.category)}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">{file.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-400">{file.extension.toUpperCase()}</td>

                    <td className="px-4 py-3 font-mono font-medium text-white tabular-nums">
                      {file.size}
                    </td>

                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px] truncate max-w-[160px]">
                      {file.originalLocation}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={file.status} />
                    </td>

                    <td className="px-4 py-3 font-mono font-bold">
                      <span
                        className={
                          file.confidence >= 90
                            ? 'text-emerald-400'
                            : file.confidence >= 85
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        }
                      >
                        {file.confidence}%
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                      {file.sha256.substring(0, 16)}...
                    </td>

                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <span className="font-medium text-[11px] text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40 whitespace-nowrap">
                        {file.classification}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedFile(file)}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                          title="Preview Metadata & Hex"
                        >
                          <Eye className="w-3.5 h-3.5" />
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
          {filteredFiles.map(file => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between group shadow-sm text-xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    {getCategoryIcon(file.category)}
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                    {file.confidence}% Conf
                  </span>
                </div>

                <h3 className="font-semibold text-white mt-3 group-hover:text-cyan-300 transition-colors truncate">
                  {file.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">{file.id} · {file.size}</p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Status:</span>
                    <StatusBadge status={file.status} size="sm" />
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Classification:</span>
                    <span className="text-cyan-300 font-medium">{file.classification}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Method:</span>
                    <span className="text-slate-300">{file.recoveryMethod}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500 truncate max-w-[140px]">
                  {file.sha256.substring(0, 12)}...
                </span>
                <span className="text-cyan-400 font-medium group-hover:underline">
                  Inspect Artifact →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Preview Modal */}
      <FilePreviewModal />
    </div>
  );
};
