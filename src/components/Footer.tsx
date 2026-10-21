import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import {
  Github,
  Linkedin,
  Mail,
  Shield,
  BarChart3,
  FileText,
  Heart,
  ArrowUp,
} from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
  onOpenResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenAdmin,
  onOpenResume,
}) => {
  const { data } = usePortfolio();
  const profile = data?.profile;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#04060d] border-t border-white/5 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Identity */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                JB
              </div>
              <span className="font-bold text-white text-base">
                {profile?.name || 'Jiya Baghel'}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              B.Tech Computer Science student specializing in Artificial Intelligence and Machine Learning at Symbiosis Institute of Technology, Nagpur.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={profile?.githubUrl || 'https://github.com/Jiya2006'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={profile?.linkedinUrl || 'https://www.linkedin.com/in/jiya-baghel-3724a7241'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-300 hover:border-sky-500/50 transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${profile?.email || 'jiyab623@gmail.com'}`}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 transition-colors"
                aria-label="Email Jiya"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-mono uppercase text-slate-300 text-xs font-semibold tracking-wider mb-2">
              Navigation
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#about" className="hover:text-sky-300 transition-colors">
                  About & Academics
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-sky-300 transition-colors">
                  Technical Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-sky-300 transition-colors">
                  Projects Showcase (10)
                </a>
              </li>
              <li>
                <a href="#leadership" className="hover:text-sky-300 transition-colors">
                  Leadership & Honors
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-sky-300 transition-colors">
                  Contact & Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Privacy & Admin Services */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono uppercase text-slate-300 text-xs font-semibold tracking-wider mb-2">
              System & Transparency
            </div>
            <div className="space-y-2">
              <button
                onClick={onOpenPrivacy}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-left"
              >
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Privacy Notice & Analytics Policy</span>
              </button>

              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-left"
              >
                <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Private Visitor Telemetry & Resend Hub</span>
              </button>

              <button
                onClick={onOpenResume}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-left"
              >
                <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Qualifications & Resume Status</span>
              </button>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Transactional email delivery powered by Resend
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div>
            © {new Date().getFullYear()} {profile?.name || 'Jiya Baghel'}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with React, TypeScript & Tailwind CSS
            </span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Scroll to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
