import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import {
  Send,
  Mail,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Github,
  Linkedin,
  MapPin,
  Clock,
  Loader2,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data?.profile;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consent: false,
    honeypot: '', // bot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatusMessage(null);

    // Client-side quick check
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your full name.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must agree to the data consent policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setStatusMessage({
            type: 'error',
            text: result.message || 'Submission failed. Please try again.',
          });
        }
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Thank you! Your message was sent securely to Jiya Baghel. An automated confirmation was dispatched.',
        });
        setFormData({
          name: '',
          email: '',
          message: '',
          consent: false,
          honeypot: '',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Network error occurred while submitting message. Please check your connection.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/20 text-sky-400 text-xs font-mono uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect & Collaborate
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Reach out regarding AI/ML internship opportunities, research collaborations, or technical projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info & Resend Notice */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-6 border border-white/10">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Contact Coordinates
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${profile?.email || 'jiyab623@gmail.com'}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Direct Email</div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                      {profile?.email || 'jiyab623@gmail.com'}
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Location</div>
                    <div className="text-sm font-semibold text-slate-200">
                      {profile?.location || 'Nagpur, Maharashtra, India'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Response Horizon</div>
                    <div className="text-sm font-semibold text-slate-200">
                      Within 24-48 business hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="text-xs font-mono uppercase text-slate-400">
                  Verified Channels
                </div>
                <div className="flex gap-2">
                  <a
                    href={profile?.githubUrl || 'https://github.com/Jiya2006'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs font-medium text-slate-200 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href={profile?.linkedinUrl || 'https://www.linkedin.com/in/jiya-baghel-3724a7241'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 text-xs font-medium text-sky-300 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-sky-400" />
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Resend Integration info pill */}
              <div className="p-3.5 rounded-xl bg-sky-950/50 border border-sky-500/20 text-xs text-sky-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-white">Resend Dispatch Architecture:</span> Submissions trigger encrypted transactional notifications to <span className="font-mono text-white">jiyab623@gmail.com</span> with rate-limiting and anti-spam protection.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Secure Form */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              Send a Secure Message
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              All messages are dispatched directly to Jiya Baghel's mailbox. Required fields are clearly indicated.
            </p>

            {statusMessage && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>{statusMessage.text}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Bot trap honeypot */}
              <input
                type="text"
                name="user_token_trap"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5"
                >
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Sharma"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors text-sm ${
                    errors.name
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-700/80 focus:border-sky-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5"
                >
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors text-sm ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-700/80 focus:border-sky-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5"
                >
                  Message <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Detail your inquiry, project scope, or internship opportunity..."
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors text-sm resize-y min-h-[100px] ${
                    errors.message
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-700/80 focus:border-sky-500'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => {
                      setFormData({ ...formData, consent: e.target.checked });
                      if (errors.consent) setErrors({ ...errors, consent: '' });
                    }}
                    className="mt-1 w-4 h-4 rounded border-slate-700 text-sky-600 focus:ring-sky-500 bg-slate-900"
                  />
                  <span className="text-xs text-slate-400 leading-normal">
                    I consent to having my submitted name, email, and message processed and transmitted securely via Resend to Jiya Baghel (<span className="text-sky-300 font-mono">jiyab623@gmail.com</span>) for the purpose of responding to this communication.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Transmitting via Resend...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Verified Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
