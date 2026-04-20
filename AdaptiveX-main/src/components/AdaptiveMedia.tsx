import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptive } from '../context/AdaptiveContext';
import { cn } from '../utils/cn';
import { useIntersection } from '../hooks/useIntersection';
import type { SectionId } from '../hooks/useIntelligence';

interface AdaptiveMediaProps {
  onInteract: (id: SectionId) => void;
}

const QUALITY_CONFIG = {
  low:    { label: '144p',   blur: 'blur-[3px] saturate-50 brightness-75', badge: 'bg-red-500/20 text-red-300 border-red-500/30' },
  medium: { label: '720p',   blur: '',                                      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  high:   { label: '4K HDR', blur: '',                                      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

const LOAD_TIMES = { performance: 300, balanced: 900, quality: 1800 };

export const AdaptiveMedia = ({ onInteract }: AdaptiveMediaProps) => {
  const { mediaQuality, activeMode, animationsEnabled } = useAdaptive();
  const { ref, isVisible } = useIntersection(0.2);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentQuality, setCurrentQuality] = useState(mediaQuality);

  useEffect(() => {
    setIsLoading(true);
    setLoadProgress(0);

    const duration = LOAD_TIMES[activeMode];
    const steps = 20;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setLoadProgress(Math.min(Math.round((step / steps) * 100), 100));
      if (step >= steps) {
        clearInterval(timer);
        setIsLoading(false);
        setCurrentQuality(mediaQuality);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [mediaQuality, activeMode]);

  const qConf = QUALITY_CONFIG[currentQuality];

  return (
    <section
      id="media"
      ref={ref}
      className="w-full max-w-5xl mx-auto px-4"
      onMouseEnter={() => onInteract('media')}
      onClick={() => onInteract('media')}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Live Adaptive Demo
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Media Quality That Thinks
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm">
          Switch modes below — watch resolution, load time, and visual quality transform instantly.
        </p>
      </motion.div>

      {/* Media Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black card-hover group"
      >
        {/* Skeleton / Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0a]"
            >
              {/* Skeleton rows */}
              <div className="w-full h-full p-8 flex flex-col gap-4">
                <div className="skeleton h-8 w-2/3 rounded-lg" />
                <div className="flex gap-4 flex-1">
                  <div className="skeleton flex-1 rounded-xl" />
                  <div className="flex flex-col gap-3 w-1/3">
                    <div className="skeleton h-12 rounded-lg" />
                    <div className="skeleton h-12 rounded-lg" />
                    <div className="skeleton flex-1 rounded-xl" />
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-1 bg-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-600 to-brand-400"
                    animate={{ width: `${loadProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="px-4 py-3 flex justify-between items-center bg-black/60 backdrop-blur-sm">
                  <span className="text-xs font-mono text-zinc-500">
                    Optimizing for <span className="text-brand-400">{activeMode}</span> mode…
                  </span>
                  <span className="text-xs font-mono text-brand-400">{loadProgress}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actual image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={`${currentQuality}-${activeMode}`}
            src="/dashboard.png"
            alt="Adaptive media demo"
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationsEnabled ? 0.8 : 0.1 }}
            className={cn(
              'w-full h-full object-cover transition-all duration-700',
              qConf.blur
            )}
          />
        </AnimatePresence>

        {/* Quality badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuality}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'absolute top-3 right-3 z-10 px-3 py-1 rounded-full border text-xs font-bold backdrop-blur-md font-mono',
              qConf.badge
            )}
          >
            ◈ {qConf.label}
          </motion.div>
        </AnimatePresence>

        {/* Before/After overlay in quality mode */}
        {activeMode === 'quality' && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-3 left-3 z-10 flex gap-2"
          >
            <div className="px-3 py-1.5 rounded-xl glass border border-white/10 text-xs font-mono text-emerald-400">
              ✓ Full fidelity · 4K HDR loaded
            </div>
          </motion.div>
        )}

        {activeMode === 'performance' && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-3 left-3 z-10"
          >
            <div className="px-3 py-1.5 rounded-xl glass border border-brand-500/20 text-xs font-mono text-brand-400">
              ⚡ 85% less data · 3× faster load
            </div>
          </motion.div>
        )}

        {/* Hover overlay indicator */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>

      {/* Quality comparison pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-3 mt-4 justify-center"
      >
        {(['low', 'medium', 'high'] as const).map(q => (
          <div key={q} className={cn(
            'px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300',
            currentQuality === q
              ? QUALITY_CONFIG[q].badge + ' shadow-lg'
              : 'border-white/10 text-zinc-600'
          )}>
            {currentQuality === q && '→ '}{QUALITY_CONFIG[q].label}
          </div>
        ))}
      </motion.div>
    </section>
  );
};
