import React, { ReactNode } from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 mb-4">
        {icon || <Database className="w-8 h-8" />}
      </div>
      <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
