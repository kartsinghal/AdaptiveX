import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../hooks/useMousePosition';
import { useAdaptive } from '../context/AdaptiveContext';
import { ChevronRight, ArrowDown } from 'lucide-react';
import type { SectionId } from '../hooks/useIntelligence';

interface HeroSectionProps {
  onInteract: (id: SectionId) => void;
}

export const HeroSection = ({ onInteract }: HeroSectionProps) => {
  const { activeMode, animationsEnabled } = useAdaptive();
  const mouse = useMousePosition();
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax offsets based on mouse — disabled in performance mode
  const px = animationsEnabled ? (mouse.x / window.innerWidth - 0.5) * 18 : 0;
  const py = animationsEnabled ? (mouse.y / window.innerHeight - 0.5) * 10 : 0;

  // Time-based hover tracking
  const hoverStart = useRef<number>(0);

  const handleMouseEnter = () => {
    hoverStart.current = Date.now();
    onInteract('hero');
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden"
      onMouseEnter={handleMouseEnter}
    >
      {/* Background radial glow — quality-aware */}
      {activeMode !== 'performance' && (
        <motion.div
          animate={{ x: px * 2, y: py * 2 }}
          transition={{ type: 'spring', stiffness: 40, damping: 20 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className={`rounded-full blur-[120px] transition-all duration-700 ${
              activeMode === 'quality'
                ? 'w-[900px] h-[600px] bg-brand-500/25'
                : 'w-[600px] h-[400px] bg-brand-500/12'
            }`}
          />
        </motion.div>
      )}

      {/* Floating accent orbs — only in quality mode */}
      {activeMode === 'quality' && (
        <>
          <motion.div
            animate={{ x: px * -1.5, y: py * -2, rotate: 15 }}
            transition={{ type: 'spring', stiffness: 30, damping: 18 }}
            className="absolute top-32 left-24 w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500/20 to-amber-500/10 border border-brand-500/20 blur-sm pointer-events-none animate-float"
          />
          <motion.div
            animate={{ x: px * 2, y: py * 1.5, rotate: -10 }}
            transition={{ type: 'spring', stiffness: 25, damping: 15 }}
            className="absolute bottom-40 right-28 w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/15 to-transparent border border-violet-500/15 pointer-events-none animate-float"
            style={{ animationDelay: '1.5s' }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8 cursor-pointer hover:border-brand-500/30 transition-colors duration-200"
          onClick={() => onInteract('hero')}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
            Adaptive UI Engine 2.0 · Live Demo
          </span>
        </motion.div>

        {/* Headline with parallax */}
        <motion.div
          animate={animationsEnabled ? { x: px * 0.5, y: py * 0.3 } : {}}
          transition={{ type: 'spring', stiffness: 50, damping: 25 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6"
          >
            Intelligence That{' '}
            <span className="text-gradient">Adapts</span>
            <br />
            <span className="text-zinc-400 font-light">to Your World</span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 transition-all duration-500 ${
            activeMode === 'performance' ? 'text-base' : ''
          }`}
        >
          Watch this app detect your network, device, and behavior — then silently
          optimize every pixel for your exact conditions.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => {
              onInteract('media');
              document.getElementById('media')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-full font-semibold transition-all duration-200 flex items-center gap-2 glow-brand hover:glow-sm hover:scale-105 active:scale-95"
          >
            Launch Demo
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => {
              onInteract('intelligence');
              document.getElementById('intelligence')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 glass text-white hover:bg-white/10 rounded-full font-semibold transition-all duration-200 border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95"
          >
            See Intelligence
          </button>
        </motion.div>

        {/* Mode-adaptive message */}
        <motion.div
          key={activeMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-xs font-mono text-zinc-600"
        >
          {activeMode === 'performance' && '⚡ Performance mode active — animations minimized, bandwidth conserved'}
          {activeMode === 'balanced' && '⚖ Balanced mode — moderate fidelity across device constraints'}
          {activeMode === 'quality' && '✦ Quality mode — full rendering, 4K assets, all animations enabled'}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600"
      >
        <span className="text-xs uppercase tracking-widest">Explore</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
};
