import React, { useState, useEffect } from 'react';
import {
  Lock,
  X,
  ShieldCheck,
  Globe,
  Smartphone,
  Mail,
  Send,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Radio,
  FileText,
  Key,
} from 'lucide-react';
import { AnalyticsSummary, VisitorLog, ContactMessage } from '../types/portfolio.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('jiya_admin_token'));
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'visitors' | 'messages' | 'analytics' | 'setup'>('visitors');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        sessionStorage.setItem('jiya_admin_token', data.token);
        fetchStats(data.token);
      } else {
        setAuthError(data.message || 'Invalid passcode. Default is "jiya2026"');
      }
    } catch (err: any) {
      setAuthError('Network error while authenticating');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.summary);
      } else if (res.status === 401) {
        setToken(null);
        sessionStorage.removeItem('jiya_admin_token');
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchStats(token);
    }
  }, [isOpen, token]);

  const handleSendTestEmail = async () => {
    if (!token) return;
    setTestEmailLoading(true);
    setTestEmailStatus(null);
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTestEmailStatus(`Success: Email dispatched to ${stats?.targetEmail || 'jiyab623@gmail.com'}`);
      } else {
        setTestEmailStatus(`Error: ${data.error || data.message}`);
      }
    } catch (err: any) {
      setTestEmailStatus(`Error: ${err.message}`);
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('jiya_admin_token');
    setStats(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div className="glass-panel max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="admin-modal-title" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Private Visitor Analytics & Resend Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                  Restricted
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-time IP logs & Resend Email Delivery to jiyab623@gmail.com
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-800/60"
              >
                Lock
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication View */}
        {!token ? (
          <div className="max-w-md mx-auto py-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-sky-400">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Admin Passcode Required</h4>
              <p className="text-xs text-slate-400">
                Enter your administrative passcode to review visitor telemetry, IP tracking logs, and messages.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Passcode
                </label>
                <input
                  type="password"
                  placeholder="Enter passcode (default: jiya2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                {loading ? 'Authenticating...' : 'Unlock Telemetry Dashboard'}
              </button>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-500 font-mono text-center">
                Default local passcode: <span className="text-sky-300">jiya2026</span> (configured via ADMIN_PASSCODE in .env)
              </div>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard View */
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Total Visits</span>
                  <Radio className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {stats?.totalVisits ?? 0}
                </div>
                <div className="text-[10px] text-slate-500">Page Impressions</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Unique Visitors</span>
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {stats?.uniqueIps ?? 0}
                </div>
                <div className="text-[10px] text-slate-500">Unique IP Addresses</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Inquiries</span>
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {stats?.contactMessages?.length ?? 0}
                </div>
                <div className="text-[10px] text-slate-500">Messages Received</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Resend Service</span>
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-xs font-bold mt-1.5 flex items-center gap-1.5">
                  {stats?.resendConfigured ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Ready for Key
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 truncate" title={stats?.targetEmail}>
                  {stats?.targetEmail || 'jiyab623@gmail.com'}
                </div>
              </div>
            </div>

            {/* Test Resend Action Banner */}
            <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  Resend Email Dispatch Target: <span className="font-mono text-sky-300">{stats?.targetEmail}</span>
                </div>
                <div className="text-slate-400">
                  Sends visitor IP, city, region, country, and device alerts directly to your Gmail inbox.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendTestEmail}
                  disabled={testEmailLoading}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {testEmailLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Test Resend Dispatch
                </button>
              </div>

              {testEmailStatus && (
                <div className="w-full text-xs font-mono p-2 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {testEmailStatus}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('visitors')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'visitors'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  Visitor Logs ({stats?.recentVisits?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'messages'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  Inquiries ({stats?.contactMessages?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  Geo & Devices
                </button>
                <button
                  onClick={() => setActiveTab('setup')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'setup'
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  Resend Setup Guide
                </button>
              </div>

              <button
                onClick={() => token && fetchStats(token)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900"
                title="Refresh stats"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Tab 1: Visitor Logs */}
            {activeTab === 'visitors' && (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="py-2.5 px-3">IP Address</th>
                        <th className="py-2.5 px-3">Location (City / Region / Country)</th>
                        <th className="py-2.5 px-3">Device / Browser</th>
                        <th className="py-2.5 px-3">ISP / Network</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Resend Mail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {stats?.recentVisits && stats.recentVisits.length > 0 ? (
                        stats.recentVisits.map((v: VisitorLog) => (
                          <tr key={v.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
                                {v.ip}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {v.city || 'Unknown'}, {v.region || ''} ({v.country || 'N/A'})
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">
                              {v.deviceType} • {v.browser}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">
                              {v.isp || 'N/A'}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">
                              {v.timestamp}
                            </td>
                            <td className="py-2.5 px-3">
                              {v.emailSent ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Sent
                                </span>
                              ) : (
                                <span className="text-slate-500" title={v.emailError || 'Pending key'}>
                                  Logged
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">
                            No visitor records yet. Visits are automatically logged on load.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Contact Inquiries */}
            {activeTab === 'messages' && (
              <div className="space-y-3">
                {stats?.contactMessages && stats.contactMessages.length > 0 ? (
                  stats.contactMessages.map((msg: ContactMessage) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white text-sm">
                          {msg.name}{' '}
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-sky-400 font-mono text-xs hover:underline ml-2"
                          >
                            &lt;{msg.email}&gt;
                          </a>
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          {msg.timestamp} • IP: {msg.ip}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                        {msg.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No contact form messages submitted yet.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Geo & Devices */}
            {activeTab === 'analytics' && (
              <div className="grid md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white uppercase font-mono tracking-wider">
                    Geographic Distribution
                  </h4>
                  {stats?.countries && Object.keys(stats.countries).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(stats.countries).map(([country, count]) => (
                        <div key={country} className="flex items-center justify-between py-1 border-b border-slate-800">
                          <span className="text-slate-300 font-medium">{country}</span>
                          <span className="font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded">
                            {count} visit{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 py-4">No geographic data collected yet.</div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white uppercase font-mono tracking-wider">
                    Device Categories
                  </h4>
                  {stats?.devices && Object.keys(stats.devices).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(stats.devices).map(([device, count]) => (
                        <div key={device} className="flex items-center justify-between py-1 border-b border-slate-800">
                          <span className="text-slate-300 font-medium">{device}</span>
                          <span className="font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                            {count} device{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 py-4">No device data collected yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Resend Setup Guide */}
            {activeTab === 'setup' && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Key className="w-4 h-4 text-sky-400" />
                  <span>How Resend Email Notifications Work</span>
                </div>
                <p className="leading-relaxed">
                  Your portfolio is built to alert you whenever a new visitor visits your portfolio with their IP, City, Region, Country, ISP, and Device, or when someone submits the contact form.
                </p>
                <div className="space-y-2 pl-4 list-decimal">
                  <div>
                    <strong className="text-white">1. Get a free API Key:</strong> Visit{' '}
                    <a
                      href="https://resend.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 underline"
                    >
                      resend.com
                    </a>{' '}
                    and generate a free API key (free tier includes 3,000 emails/month).
                  </div>
                  <div>
                    <strong className="text-white">2. Set Environment Variable:</strong> In your hosting dashboard (or <span className="font-mono text-sky-300">.env</span> file), set:
                    <pre className="mt-1 p-2.5 rounded bg-slate-950 font-mono text-[11px] text-emerald-300">
                      RESEND_API_KEY="re_123456789..."{'\n'}
                      NOTIFICATION_EMAIL="jiyab623@gmail.com"
                    </pre>
                  </div>
                  <div>
                    <strong className="text-white">3. Automatic Dispatch:</strong> The server automatically sends every new visitor notification and contact message directly to <strong className="text-white">jiyab623@gmail.com</strong> with zero client secrets exposed.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
