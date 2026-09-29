import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', pulse = false }) => {
  const normalized = status.toLowerCase();

  let dotColor = 'bg-slate-400';
  let textColor = 'text-slate-300';
  let bgColor = 'bg-slate-800/60 border-slate-700/60';

  if (
    normalized.includes('ready') ||
    normalized.includes('verified') ||
    normalized.includes('success') ||
    normalized.includes('intact') ||
    normalized.includes('signed') ||
    normalized.includes('good')
  ) {
    dotColor = 'bg-emerald-400';
    textColor = 'text-emerald-300';
    bgColor = 'bg-emerald-950/40 border-emerald-800/40';
  } else if (
    normalized.includes('sanitized') ||
    normalized.includes('zeroed') ||
    normalized.includes('tier 1')
  ) {
    dotColor = 'bg-cyan-400';
    textColor = 'text-cyan-300';
    bgColor = 'bg-cyan-950/40 border-cyan-800/40';
  } else if (
    normalized.includes('acquired') ||
    normalized.includes('active') ||
    normalized.includes('in analysis') ||
    normalized.includes('in review') ||
    normalized.includes('carved') ||
    normalized.includes('high')
  ) {
    dotColor = 'bg-indigo-400';
    textColor = 'text-indigo-300';
    bgColor = 'bg-indigo-950/40 border-indigo-800/40';
  } else if (
    normalized.includes('scanning') ||
    normalized.includes('initializing') ||
    normalized.includes('computing') ||
    normalized.includes('warning') ||
    normalized.includes('draft') ||
    normalized.includes('fragmented')
  ) {
    dotColor = 'bg-amber-400';
    textColor = 'text-amber-300';
    bgColor = 'bg-amber-950/40 border-amber-800/40';
  } else if (
    normalized.includes('corrupted') ||
    normalized.includes('error') ||
    normalized.includes('critical') ||
    normalized.includes('flagged')
  ) {
    dotColor = 'bg-rose-400';
    textColor = 'text-rose-300';
    bgColor = 'bg-rose-950/40 border-rose-800/40';
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${bgColor} ${textColor} ${paddingClass} tracking-wide whitespace-nowrap`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColor} ${pulse ? 'animate-ping' : ''}`}
        aria-hidden="true"
      />
      <span>{status}</span>
    </span>
  );
};
