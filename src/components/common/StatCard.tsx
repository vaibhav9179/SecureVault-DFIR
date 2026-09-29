import React, { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  highlightColor?: 'cyan' | 'blue' | 'indigo' | 'emerald' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon,
  trend,
  highlightColor = 'cyan'
}) => {
  const accentBorderColors = {
    cyan: 'hover:border-cyan-500/40',
    blue: 'hover:border-blue-500/40',
    indigo: 'hover:border-indigo-500/40',
    emerald: 'hover:border-emerald-500/40',
    amber: 'hover:border-amber-500/40'
  };

  const accentGlow = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400'
  };

  return (
    <div
      className={`relative p-5 rounded-xl bg-slate-900/80 border border-slate-800 transition-all duration-200 ${accentBorderColors[highlightColor]} group shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{label}</p>
          <p className="mt-2 text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white tabular-nums">
            {value}
          </p>
        </div>
        {icon && (
          <div className={`p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 ${accentGlow[highlightColor]} transition-transform duration-200 group-hover:scale-105`}>
            {icon}
          </div>
        )}
      </div>

      {(subValue || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          {subValue && <span>{subValue}</span>}
          {trend && (
            <span
              className={`font-mono font-medium ${
                trend.positive
                  ? 'text-emerald-400'
                  : trend.neutral
                  ? 'text-slate-300'
                  : 'text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
