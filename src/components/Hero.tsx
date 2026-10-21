import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import {
  ArrowDown,
  FileDown,
  Send,
  Github,
  Linkedin,
  Sparkles,
  Terminal,
  Cpu,
  GraduationCap,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const { data, loading } = usePortfolio();

  const profile = data?.profile;

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Ambient Glows */}
      <div
        className="glow-ambient w-96 h-96 -top-20 -left-20 bg-sky-500/20"
        aria-hidden="true"
      />
      <div
        className="glow-ambient w-[32rem] h-[32rem] top-1/4 -right-24 bg-indigo-600/20"
        aria-hidden="true"
      />
      <div
        className="glow-ambient w-80 h-80 bottom-0 left-1/3 bg-cyan-500/15"
        aria-hidden="true"
      />

      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0f_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bio & Calls to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-mono tracking-wide shadow-sm shadow-sky-950">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>Available for AI/ML Internships & Projects</span>
            </div>

            {/* Name & Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I'm{' '}
                <span className="gradient-text font-black">
                  {loading ? 'Jiya Baghel' : profile?.name}
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-300 tracking-tight flex items-center justify-center lg:justify-start gap-2">
                <Terminal className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{profile?.headline || 'AI/ML Student | Python Developer | Aspiring Software Engineer'}</span>
              </h2>
            </div>

            {/* Bio / Short Intro */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {profile?.shortIntro ||
                'Specializing in Artificial Intelligence and Machine Learning with hands-on experience in predictive modeling, data analysis, and software development.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 hover:from-sky-400 hover:to-indigo-500 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>View Projects</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/40 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <FileDown className="w-4 h-4 text-sky-400" />
                <span>Download Resume</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200"
              >
                <Send className="w-4 h-4 text-indigo-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Links & Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-slate-400 text-sm">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 font-mono">
                Connect:
              </span>
              <a
                href={profile?.githubUrl || 'https://github.com/Jiya2006'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-mono">GitHub</span>
              </a>

              <a
                href={profile?.linkedinUrl || 'https://www.linkedin.com/in/jiya-baghel-3724a7241'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-300 transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono">LinkedIn</span>
              </a>

              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Nagpur, India
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Tech Holographic Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative gradient frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 opacity-30 blur-xl"></div>

              {/* Main Card */}
              <div className="relative glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl">
                {/* Code Terminal Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="text-xs font-mono text-slate-400 ml-2">jiya_profile.py</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                    B.Tech AI/ML
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-sky-400 text-xs font-mono mb-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Academic</span>
                    </div>
                    <div className="text-xl font-bold text-white tracking-tight">7.5 CGPA</div>
                    <div className="text-[10px] text-slate-400">Semester Record</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Projects</span>
                    </div>
                    <div className="text-xl font-bold text-white tracking-tight">10 Built</div>
                    <div className="text-[10px] text-slate-400">ML, Web, Hardware</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Core Stack</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200">Python & ML</div>
                    <div className="text-[10px] text-slate-400">NumPy, pandas, Scikit</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Leadership</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200">Organising Sec.</div>
                    <div className="text-[10px] text-slate-400">SIT Nagpur Events</div>
                  </div>
                </div>

                {/* Interactive highlight snippet */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
                  <div className="text-slate-500"># Symbiosis Institute of Technology, Nagpur</div>
                  <div>
                    <span className="text-purple-400">class</span>{' '}
                    <span className="text-sky-300">SoftwareEngineerCandidate</span>:
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-400">focus</span> = [
                    <span className="text-emerald-300">"Machine Learning"</span>,{' '}
                    <span className="text-emerald-300">"Python"</span>,{' '}
                    <span className="text-emerald-300">"Problem Solving"</span>]
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-400">mentality</span> ={' '}
                    <span className="text-amber-300">"Practical implementation over hype"</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Visitor Telemetry Enabled
                  </span>
                  <a
                    href="#about"
                    className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 transition-colors"
                  >
                    Read profile <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
