import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface SimulationBannerProps {
  message?: string;
  subText?: string;
  variant?: 'cyan' | 'amber';
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({
  message = 'Simulation Mode — No real device or original evidence will be modified.',
  subText = 'Hardware write-blocker emulation active. Zero byte writes permitted on source disks.',
  variant = 'cyan'
}) => {
  const isCyan = variant === 'cyan';

  return (
    <div
      className={`rounded-lg border px-4 py-3 flex items-start sm:items-center gap-3 ${
        isCyan
          ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-200'
          : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
      }`}
    >
      <div
        className={`p-1.5 rounded shrink-0 ${
          isCyan ? 'bg-cyan-900/40 text-cyan-400' : 'bg-amber-900/40 text-amber-400'
        }`}
      >
        {isCyan ? <ShieldCheck className="w-4 h-4" /> : <Info className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold tracking-wide uppercase">{message}</p>
        {subText && <p className="text-xs opacity-80 mt-0.5">{subText}</p>}
      </div>
      <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono shrink-0 px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        SAFE ENCLAVE
      </div>
    </div>
  );
};
