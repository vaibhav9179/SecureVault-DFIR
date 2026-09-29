import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3">
      <div className="h-10 bg-slate-800/60 rounded-lg w-full"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-900/60 border border-slate-800/60 rounded-lg w-full flex items-center px-4 space-x-4">
          <div className="h-4 bg-slate-800 rounded w-1/4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/6"></div>
          <div className="h-4 bg-slate-800 rounded w-1/5"></div>
          <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
};
