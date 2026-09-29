import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Lock, KeyRound, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('d.reynolds@dfir-agency.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/');
  };

  const handleDemoLogin = () => {
    login('demo.investigator@dfir.local');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background cyber grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
        {/* Header / Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SecureVault DFIR</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
            Secure Data Sanitization & Digital Forensic Recovery
          </p>
        </div>

        {/* Security Badge */}
        <div className="mb-6 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between text-[11px] text-cyan-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>NIST SP 800-88 Compliant · ISO 27037</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 font-semibold">AIR-GAPPED</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Investigator Credential / Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="agent@dfir-agency.gov"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Authentication Passcode / PIV Token</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
              />
              <span>Retain workstation session</span>
            </label>
            <span className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer">
              Hardware Key Login?
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate Session</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium text-xs border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant 1-Click Demo Login</span>
            </button>
          </div>
        </form>

        {/* Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            Frontend Simulation Enclave for SIH Cyber Forensics Demonstration.
          </p>
        </div>
      </div>
    </div>
  );
};
