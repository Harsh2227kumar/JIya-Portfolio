import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import {
  FileText,
  X,
  GraduationCap,
  Sparkles,
  Download,
  Mail,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();
  const profile = data?.profile;

  if (!isOpen) return null;

  const handleDownloadSummary = () => {
    const summaryData = {
      candidate: profile?.name,
      headline: profile?.headline,
      institution: profile?.institution,
      degree: profile?.degree,
      specialization: profile?.specialization,
      semesterCgpa: profile?.semesterCgpa,
      skills: data?.skillCategories.map((c) => ({
        category: c.name,
        items: c.skills.map((s) => `${s.name} (${s.level})`),
      })),
      projects: data?.projects.map((p) => ({
        title: p.title,
        category: p.category,
        status: p.status,
        tech: p.technologies,
      })),
      achievements: data?.achievements.map((a) => ({
        title: a.title,
        role: a.role,
        category: a.category,
      })),
      links: {
        github: profile?.githubUrl,
        linkedin: profile?.linkedinUrl,
        email: profile?.email,
      },
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jiya_Baghel_Portfolio_Profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="resume-modal-title" className="text-xl font-bold text-white tracking-tight">
                Curriculum Vitae & Qualifications
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {profile?.name} • Academic & Technical Dossier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
            aria-label="Close resume modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transparent Document Notice */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-xs text-amber-200/90 space-y-1.5">
          <div className="font-semibold text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Formal PDF Document Status
          </div>
          <p className="leading-relaxed">
            The official PDF resume is being formatted for forthcoming internship placement drives. In accordance with honest portfolio guidelines, this preview reflects verified coursework, semester CGPA (7.5), and approved projects.
          </p>
        </div>

        {/* Structured Credentials Overview */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs font-mono uppercase text-sky-400 font-semibold flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Degree & Institution
            </div>
            <div className="text-base font-bold text-white">
              {profile?.institution}
            </div>
            <div className="text-xs text-slate-300">
              {profile?.degree} — Specialization in {profile?.specialization}
            </div>
            <div className="text-xs font-mono text-amber-300 pt-1">
              Semester CGPA: 7.5 (Academic Term Record)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs font-mono uppercase text-indigo-400 font-semibold">
              Primary Competencies
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Python', 'Machine Learning', 'NumPy', 'pandas', 'Data Structures', 'Java', 'C', 'GitHub'].map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs font-mono uppercase text-emerald-400 font-semibold">
              Key Verified Projects
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Diabetes Prediction Model (Machine Learning Classification)</li>
              <li>Credit Card Fraud Detection (Imbalanced Data Anomaly Detection)</li>
              <li>Underwater Sensor Network Simulation (ns-3 / WSL)</li>
              <li>CA Workease (AI/ML Automation — Ongoing)</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownloadSummary}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-sky-400" />
            Download Structured Profile (JSON)
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${profile?.email || 'jiyab623@gmail.com'}?subject=Inquiry%20regarding%20Resume%20for%20Jiya%20Baghel`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl shadow"
            >
              <Mail className="w-4 h-4" />
              Request Formal Copy
            </a>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
