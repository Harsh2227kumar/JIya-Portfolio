import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import {
  Code,
  Globe,
  Brain,
  Layers,
  GitBranch,
  Coffee,
  Cpu,
  Table,
  Binary,
  BookOpen,
  Palette,
  Terminal,
  CheckCircle,
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const categories = data?.skillCategories || [];
  const [activeTab, setActiveTab] = useState<string>('all');

  // Icon mapper helper
  const renderSkillIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-4 h-4 text-sky-400" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-rose-400" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'Palette':
        return <Palette className="w-4 h-4 text-pink-400" />;
      case 'Brain':
        return <Brain className="w-4 h-4 text-violet-400" />;
      case 'Binary':
        return <Binary className="w-4 h-4 text-cyan-400" />;
      case 'Table':
        return <Table className="w-4 h-4 text-teal-400" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-amber-300" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'GitBranch':
        return <GitBranch className="w-4 h-4 text-orange-400" />;
      default:
        return <Terminal className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredCategories =
    activeTab === 'all'
      ? categories
      : categories.filter((cat) => cat.id === activeTab);

  return (
    <section id="skills" className="py-20 relative bg-[#070a14]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Honest & Verified Skill Stack
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Categorized technical skills with honest proficiency levels. No inflated claims or unverified frameworks.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Domains
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === cat.id
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {category.name}
                  </h3>
                  <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                    {category.skills.length} skills
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  {category.description}
                </p>

                {/* Skill Pills */}
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                          {renderSkillIcon(skill.iconName)}
                        </div>
                        <span className="text-sm font-medium text-slate-200">
                          {skill.name}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          skill.level === 'Proficient'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                            : 'bg-sky-950/80 text-sky-300 border border-sky-800/40'
                        }`}
                      >
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  Verified Coursework & Labs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
