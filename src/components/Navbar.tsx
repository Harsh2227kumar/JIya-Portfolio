import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import { Menu, X, FileText, BarChart3, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenAdmin }) => {
  const { data } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Leadership', href: '#leadership' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070913]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Back to top"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#090d1e] rounded-[10px] flex items-center justify-center">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300 text-lg">
                  JB
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 text-base tracking-tight group-hover:text-sky-300 transition-colors">
                {data?.profile.name || 'Jiya Baghel'}
              </span>
              <span className="text-[11px] font-mono text-sky-400/90 -mt-0.5">
                AI / ML Portfolio
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-white/5 rounded-full px-4 py-1.5 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-sky-300 hover:bg-white/5 rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenResume}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-200 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/30 rounded-lg transition-all duration-200 shadow-sm shadow-sky-950"
              aria-label="Open resume preview modal"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              Resume
            </button>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 rounded-lg transition-all duration-200"
              title="Private Analytics & Visitor Telemetry"
              aria-label="Open private visitor analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Telemetry</span>
            </button>

            <a
              href="#contact"
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 rounded-lg shadow-md shadow-sky-500/20 transition-all duration-200 hover:shadow-sky-500/30"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenResume}
              className="p-2 text-xs font-medium text-sky-300 bg-sky-950/60 border border-sky-500/30 rounded-lg"
              aria-label="Open resume preview"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/50 rounded-lg"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 px-3 bg-[#0d1224] border border-white/10 rounded-2xl shadow-xl space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:text-sky-300 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-800/60 rounded-xl"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Private Analytics & Telemetry
              </button>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl shadow"
              >
                Get In Touch
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
