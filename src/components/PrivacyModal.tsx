import React from 'react';
import { Shield, X, Lock, Eye, Database, Server, Check } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="glass-panel max-w-2xl w-full max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative space-y-5 text-slate-300 text-xs sm:text-sm">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-xl font-bold text-white tracking-tight">
                Privacy, Telemetry & Analytics Policy
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Full Transparency & Visitor Rights Statement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
            aria-label="Close privacy modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Principles */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
          <div className="font-semibold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            Zero Secret Personal Tracking
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            A standard visit to this portfolio website does <strong className="text-white">not</strong> disclose your name, personal email, or private identity. We only collect your name and email when you explicitly and voluntarily submit them via the Contact Form.
          </p>
        </div>

        {/* What Is Collected */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-400" />
            1. Visitor Analytics & IP Telemetry
          </h4>
          <p className="leading-relaxed">
            When a visitor lands on the portfolio, the backend server records technical session metadata to understand website traffic:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc text-slate-300 text-xs">
            <li><strong>IP Address:</strong> Used strictly for network diagnostics and approximate regional geolocation.</li>
            <li><strong>Geographic Data:</strong> City, region, and country level resolution (e.g., Nagpur, Maharashtra, India).</li>
            <li><strong>Device & User Agent:</strong> Browser name, operating system, and screen dimensions to verify responsive layouts.</li>
            <li><strong>Referrer URL:</strong> Which site or link directed you here (e.g., LinkedIn, GitHub, direct).</li>
            <li><strong>Timestamp:</strong> Accurate date and time of visit.</li>
          </ul>
        </div>

        {/* Resend Notifications */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            2. Resend Email Dispatch
          </h4>
          <p className="leading-relaxed text-xs">
            As configured by the portfolio owner, visitor telemetry summaries and voluntary contact inquiries are securely transmitted using the <strong>Resend</strong> transactional email infrastructure to the developer's registered address (<span className="font-mono text-sky-300">jiyab623@gmail.com</span>). Automatic rate-limiting and session deduplication (15-minute cooldown) prevent spam.
          </p>
        </div>

        {/* Data Protection & Dashboard */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            3. Data Retention & Dashboard Access
          </h4>
          <p className="leading-relaxed text-xs">
            Analytics telemetry is accessible exclusively through a password-protected administrative interface. Logs are retained for a rolling period of 30 days and are never sold or shared with commercial marketing data brokers.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors shadow"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
