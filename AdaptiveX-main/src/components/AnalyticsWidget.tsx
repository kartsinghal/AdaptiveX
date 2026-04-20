import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud, Timer, Gauge, TrendingUp } from 'lucide-react';
import { useAdaptive } from '../context/AdaptiveContext';
import { useCountUp } from '../hooks/useCountUp';
import { useIntersection } from '../hooks/useIntersection';
import { cn } from '../utils/cn';
import type { SectionId } from '../hooks/useIntelligence';

interface AnalyticsWidgetProps {
  onInteract: (id: SectionId) => void;
  topSection: SectionId | null;
}

const MODE_STATS = {
  performance: { savedKB: 4320, timeMs: 1200, score: 99 },
  balanced:    { savedKB: 1840, timeMs: 2400, score: 92 },
  quality:     { savedKB: 0,    timeMs: 4800, score: 85 },
};

const formatBytes = (kb: number) => kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
const formatTime = (ms: number) => ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;

export const AnalyticsWidget = ({ onInteract, topSection }: AnalyticsWidgetProps) => {
  const { activeMode, layoutDensity } = useAdaptive();
  const { ref, isVisible } = useIntersection(0.2);
  const isCompact = layoutDensity === 'compact';
  const stats = MODE_STATS[activeMode];

  const savedCount = useCountUp(stats.savedKB, 1200, isVisible);
  const timeCount  = useCountUp(stats.timeMs,  1000, isVisible);
  const scoreCount = useCountUp(stats.score,    800, isVisible);

  return (
    <section
      id="analytics"
      ref={ref}
      className="w-full max-w-5xl mx-auto px-4"
      onMouseEnter={() => onInteract('analytics')}
      onClick={() => onInteract('analytics')}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Adaptive Impact
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Real Numbers. Real Savings.</h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm">
          These metrics update instantly as you switch modes — showing the true cost/benefit of each adaptation strategy.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className={cn('grid gap-5', isCompact ? 'grid-cols-1' : 'grid-cols-3')}>

        <AnimatePresence mode="wait">
          <MetricCard
            key={`saved-${activeMode}`}
            icon={<DownloadCloud className="w-6 h-6" />}
            label="Data Saved"
            value={stats.savedKB === 0 ? '0 KB' : formatBytes(savedCount)}
            rawValue={stats.savedKB}
            maxValue={4320}
            color="emerald"
            subtext={stats.savedKB === 0 ? 'Full assets loaded' : 'vs. Quality mode baseline'}
            delay={0}
            isVisible={isVisible}
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <MetricCard
            key={`time-${activeMode}`}
            icon={<Timer className="w-6 h-6" />}
            label="Load Time"
            value={formatTime(timeCount)}
            rawValue={stats.timeMs}
            maxValue={4800}
            maxIsBad
            color="blue"
            subtext="Total content render time"
            delay={0.1}
            isVisible={isVisible}
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <MetricCard
            key={`score-${activeMode}`}
            icon={<Gauge className="w-6 h-6" />}
            label="Perf Score"
            value={`${scoreCount}/100`}
            rawValue={stats.score}
            maxValue={100}
            color="violet"
            subtext="Simulated Lighthouse score"
            delay={0.2}
            isVisible={isVisible}
          />
        </AnimatePresence>

      </div>

      {/* Intelligence recommendation */}
      <AnimatePresence>
        {topSection && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4 }}
            className="mt-6 p-4 glass rounded-2xl border border-brand-500/20 flex items-center gap-4"
          >
            <div className="p-2.5 rounded-xl bg-brand-500/15 border border-brand-500/25">
              <TrendingUp className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Recommended for you — <span className="text-brand-400 capitalize">{topSection}</span>
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Based on your interaction patterns, the engine is prioritizing this section for you.
              </p>
            </div>
            <div className="ml-auto shrink-0 text-[10px] font-mono text-zinc-600">
              intelligence engine
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  rawValue: number;
  maxValue: number;
  maxIsBad?: boolean;
  color: string;
  subtext: string;
  delay: number;
  isVisible: boolean;
}
import React from 'react';

const MetricCard = ({ icon, label, value, rawValue, maxValue, maxIsBad, color, subtext, delay, isVisible }: MetricCardProps) => {
  const pct = Math.min((rawValue / maxValue) * 100, 100);
  const barPct = maxIsBad ? 100 - pct : pct;

  const colorClasses: Record<string, { text: string; bg: string; bar: string; border: string }> = {
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', bar: 'bg-emerald-500', border: 'border-emerald-400/20' },
    blue:    { text: 'text-blue-400',    bg: 'bg-blue-400/10',    bar: 'bg-blue-500',    border: 'border-blue-400/20'    },
    violet:  { text: 'text-violet-400',  bg: 'bg-violet-400/10',  bar: 'bg-violet-500',  border: 'border-violet-400/20'  },
  };
  const c = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={cn('p-5 glass rounded-2xl border flex flex-col gap-4 card-hover cursor-default', c.border)}
    >
      <div className="flex items-center gap-3">
        <div className={cn('p-2.5 rounded-xl', c.bg, c.text)}>{icon}</div>
        <span className="text-sm font-medium text-zinc-400">{label}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn('text-4xl font-black tracking-tight', c.text)}
        >
          {value}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', c.bar)}
            initial={{ width: 0 }}
            animate={isVisible ? { width: `${barPct}%` } : {}}
            transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[11px] text-zinc-600">{subtext}</p>
      </div>
    </motion.div>
  );
};
