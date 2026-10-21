import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.tsx';
import {
  Trophy,
  Users,
  Sparkles,
  Award,
  Medal,
  CalendarCheck,
  Music,
  Lightbulb,
} from 'lucide-react';

export const Leadership: React.FC = () => {
  const { data } = usePortfolio();
  const achievements = data?.achievements || [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Leadership':
        return <Users className="w-5 h-5 text-sky-400" />;
      case 'Technical':
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'Sports':
        return <Medal className="w-5 h-5 text-yellow-400" />;
      case 'Arts':
        return <Music className="w-5 h-5 text-violet-400" />;
      default:
        return <Award className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <section id="leadership" className="py-20 relative bg-[#070a14]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Beyond The Terminal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Leadership, Athletics & Cultural Excellence
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Demonstrating disciplined execution, team leadership, high-stakes event coordination, and competitive drive.
          </p>
        </div>

        {/* Grid of Achievements */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-white/10"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mb-1">
                  {item.title}
                </h3>
                <div className="text-xs font-semibold text-sky-400 mb-3 font-mono">
                  {item.role}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.isEditableNote && (
                  <div className="mb-3 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300 font-mono">
                    Note: Additional hackathon details updateable upon final publication.
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="pt-3 border-t border-slate-800/70 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Impact Highlights Bar */}
        <div className="mt-12 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 grid sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black text-sky-400">Team Leadership</div>
            <div className="text-xs text-slate-400">
              Steering large-scale college committees & cross-functional event organizers.
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-amber-400">National Recognition</div>
            <div className="text-xs text-slate-400">
              High-pressure competitive stage presence in dance and athletic championships.
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-emerald-400">Execution Agility</div>
            <div className="text-xs text-slate-400">
              Rapid problem solving under tight timelines in hackathons and club activities.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
