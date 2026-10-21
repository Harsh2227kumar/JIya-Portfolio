import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import {
  GraduationCap,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2,
  Brain,
  Code2,
  Calendar,
} from 'lucide-react';

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data?.profile;

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/20 text-sky-400 text-xs font-mono uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Background & Focus</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineering Practical Intelligence with Rigor
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Dedicated B.Tech computer science scholar focusing on the intersection of robust programming,
            statistical machine learning, and clean software architecture.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Education & Profile Card */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {profile?.institution || 'Symbiosis Institute of Technology, Nagpur'}
                  </h3>
                  <p className="text-sm text-sky-300 font-medium">
                    {profile?.degree || 'B.Tech in Computer Science and Engineering'}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {profile?.location || 'Nagpur, Maharashtra, India'}
                  </p>
                </div>
              </div>

              {/* Semester CGPA Badge */}
              <div className="bg-sky-950/70 border border-sky-500/40 rounded-xl px-4 py-3 text-right sm:text-center shrink-0">
                <div className="text-xs text-slate-400 font-mono">Academic Record</div>
                <div className="text-2xl font-black text-sky-300 tracking-tight">7.5</div>
                <div className="text-[11px] text-amber-300 font-medium mt-0.5">
                  Semester CGPA
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                I am an undergraduate student in Computer Science & Engineering with an honors
                specialization in{' '}
                <strong className="text-white font-semibold">Artificial Intelligence & Machine Learning</strong>.
                My academic journey emphasizes transforming mathematical theory into resilient software tools.
              </p>
              <p>
                I enjoy tackling complex datasets, developing predictive ML models (such as fraud detection,
                churn prediction, and clinical diagnostic algorithms), and structuring algorithms with solid data
                structures. I value clean code, reproducible experiments, and practical application.
              </p>
            </div>

            {/* Core Values / Strengths */}
            <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-white">Honest Engineering</div>
                  <div className="text-slate-400 mt-0.5">Focus on verified skills, reproducible metrics, and transparent problem-solving.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-white">Multidisciplinary Drive</div>
                  <div className="text-slate-400 mt-0.5">Balancing algorithms with event leadership, athletic discipline, and arts.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Focus Areas & Fast Facts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-sky-400" />
                <span>Primary Technical Focus Areas</span>
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                      Supervised Machine Learning
                    </span>
                    <span className="text-[11px] font-mono text-sky-400">Scikit-learn, Python</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Binary & multi-class classification, regression analysis, evaluation metrics, and feature selection.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      Data Wrangling & Exploration
                    </span>
                    <span className="text-[11px] font-mono text-sky-400">pandas, NumPy</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cleaning skewed datasets, outlier handling, exploratory analysis, and data normalization.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      Systems & Embedded Experiments
                    </span>
                    <span className="text-[11px] font-mono text-sky-400">ns-3, C/C++, Arduino</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Acoustic sensor circuitry and network protocol simulation for specialized environments.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Fact Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-500/20 text-xs text-slate-300 flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">Academic Integrity Note:</span> CGPA of 7.5 represents previously reported semester performance, presented transparently in compliance with academic standards.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
