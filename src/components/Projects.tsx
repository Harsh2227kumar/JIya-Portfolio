import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import { ProjectItem } from '../types/portfolio.ts';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Sparkles,
  Clock,
  CheckCircle2,
  Tag,
  Filter,
} from 'lucide-react';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const projects = data?.projects || [];
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = ['all', 'AI/ML', 'Software', 'Embedded & Systems', 'Hackathon'];

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Practical Engineering Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects & Implementations
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Exploring machine learning classifiers, network protocol simulations, embedded acoustic systems, and web tools.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <div className="flex items-center gap-1 text-slate-500 text-xs mr-2 font-mono">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === cat
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All (10)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group border border-white/10"
            >
              <div>
                {/* Header with Category & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                    {project.category}
                  </span>

                  {project.status === 'In Progress' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/40 animate-pulse">
                      <Clock className="w-3 h-3" />
                      In Progress
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors tracking-tight mb-2.5">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={project.githubRepoUrl || 'https://github.com/Jiya2006'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub</span>
                </a>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Details & Specs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Project Deep Dive / Specification */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <div className="glass-panel max-w-lg w-full rounded-2xl p-6 sm:p-7 border border-white/20 shadow-2xl relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/40">
                    {selectedProject.category}
                  </span>
                  <h3 id="project-modal-title" className="text-xl font-bold text-white mt-2">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                  aria-label="Close project modal"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Project Overview
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Technologies Utilized
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 text-sky-300 border border-sky-900/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Academic & Technical Transparency
                </div>
                <p>
                  Built within academic coursework and self-directed labs. Code repositories and Jupyter notebooks are hosted on Jiya Baghel's GitHub profile.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={selectedProject.githubRepoUrl || 'https://github.com/Jiya2006'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow"
                >
                  <Github className="w-3.5 h-3.5" />
                  View on GitHub Profile
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
