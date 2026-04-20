import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MousePointer, Clock, Flame, BarChart2 } from 'lucide-react';
import { useIntersection } from '../hooks/useIntersection';
import { cn } from '../utils/cn';
import type { SectionId } from '../hooks/useIntelligence';

interface IntelligencePanelProps {
  scores: { id: SectionId; score: number }[];
  interactions: Record<SectionId, { clicks: number; hovers: number; timeMs: number }>;
  topSection: SectionId | null;
  preloadingSection: SectionId | null;
  onInteract: (id: SectionId) => void;
}

const SECTION_LABELS: Record<SectionId, string> = {
  hero:         'Hero / Landing',
  media:        'Adaptive Media',
  dashboard:    'Dashboard Preview',
  analytics:    'Analytics Widget',
  intelligence: 'Intelligence Panel',
};

export const IntelligencePanel = ({
  scores, interactions, topSection, preloadingSection, onInteract
}: IntelligencePanelProps) => {
  const { ref, isVisible } = useIntersection(0.1);
  const maxScore = Math.max(...scores.map(s => s.score), 1);

  return (
    <section
      id="intelligence"
      ref={ref}
      className="w-full max-w-5xl mx-auto px-4"
      onMouseEnter={() => onInteract('intelligence')}
      onClick={() => onInteract('intelligence')}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Brain className="w-3.5 h-3.5" /> Intelligence Engine
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          The System Is Learning You
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm">
          Every hover, click, and second spent on a section is tracked in real-time. The engine scores and reorders content priority accordingly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass rounded-3xl border border-violet-500/15 overflow-hidden"
      >
        {/* Top legend bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-violet-500/5">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
            </div>
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-widest">
              Behavioral Scoring — Live
            </span>
          </div>
          <div className="text-[10px] font-mono text-zinc-600">
            score = clicks×3 + hovers×1 + time(s)×2
          </div>
        </div>

        {/* Score rows */}
        <div className="divide-y divide-white/5">
          {scores.map(({ id, score }, idx) => {
            const rec = interactions[id];
            const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
            const isTop = id === topSection;
            const isPreloading = id === preloadingSection;

            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={cn(
                  'px-6 py-4 flex items-center gap-4 transition-all duration-300',
                  isTop && 'bg-brand-500/5',
                  isPreloading && 'bg-violet-500/5'
                )}
              >
                {/* Rank */}
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  idx === 0 ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' :
                  idx === 1 ? 'bg-zinc-700/40 text-zinc-400 border border-zinc-700' :
                              'bg-white/5 text-zinc-600 border border-transparent'
                )}>
                  {idx + 1}
                </div>

                {/* Section name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn('text-sm font-semibold', isTop ? 'text-white' : 'text-zinc-300')}>
                      {SECTION_LABELS[id]}
                    </span>
                    {isTop && (
                      <span className="px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-bold border border-brand-500/30 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" /> Top Priority
                      </span>
                    )}
                    {isPreloading && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-bold border border-violet-500/25"
                      >
                        ⟳ Preloading…
                      </motion.span>
                    )}
                  </div>

                  {/* Bar */}
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        isTop ? 'bg-gradient-to-r from-brand-600 to-brand-400' : 'bg-zinc-600'
                      )}
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: `${pct}%` } : {}}
                      transition={{ duration: 0.8, delay: idx * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 shrink-0">
                  <Stat icon={<MousePointer className="w-3 h-3" />} value={rec.clicks} label="clicks" />
                  <Stat icon={<BarChart2 className="w-3 h-3" />}   value={rec.hovers} label="hovers" />
                  <Stat icon={<Clock className="w-3 h-3" />}        value={Math.floor(rec.timeMs / 1000)} label="sec" />
                </div>

                {/* Score badge */}
                <div className={cn(
                  'w-12 text-right shrink-0 font-mono font-bold text-sm',
                  isTop ? 'text-brand-400' : 'text-zinc-600'
                )}>
                  {score}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/2 border-t border-white/5 flex flex-wrap gap-4 text-[11px] text-zinc-600 font-mono">
          <span>Engine: <span className="text-violet-400">Behavioral Scoring v2</span></span>
          <span>Prediction: <span className="text-brand-400">Hover-triggered preload</span></span>
          <span>Priority: <span className="text-emerald-400">Dynamically reordering</span></span>
          <span className="ml-auto">Interact with any section to see scores update ↑</span>
        </div>
      </motion.div>
    </section>
  );
};

const Stat = ({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) => (
  <div className="flex flex-col items-center gap-0.5">
    <div className="text-zinc-600">{icon}</div>
    <span className="text-xs font-mono text-zinc-400">{value}</span>
    <span className="text-[9px] text-zinc-700 uppercase">{label}</span>
  </div>
);
