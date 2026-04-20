import { AnimatePresence, motion } from 'framer-motion';
import { Zap, RotateCcw } from 'lucide-react';

interface ModeTransitionOverlayProps {
  show: boolean;
  mode: string;
}

export const ModeTransitionOverlay = ({ show, mode }: ModeTransitionOverlayProps) => {
  const modeConfig = {
    performance: { label: 'Performance Mode', desc: 'Minimizing data · Compressing assets · Reducing animations', color: '#f55c00' },
    balanced:    { label: 'Balanced Mode',    desc: 'Moderate fidelity · Smart caching · Adaptive layout',      color: '#3b82f6' },
    quality:     { label: 'Quality Mode',     desc: 'Full 4K · All animations · Rich glassmorphism enabled',     color: '#8b5cf6' },
  }[mode] ?? { label: 'Auto Mode', desc: 'Auto-detecting optimal settings…', color: '#f55c00' };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Radial flash */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full"
            style={{ background: `radial-gradient(circle, ${modeConfig.color}40 0%, transparent 70%)` }}
          />

          {/* Center card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="glass-strong rounded-2xl px-8 py-5 border flex flex-col items-center gap-3 shadow-2xl"
            style={{ borderColor: `${modeConfig.color}30` }}
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 animate-spin" style={{ color: modeConfig.color }} />
              <span className="text-white font-bold text-lg">{modeConfig.label}</span>
              <Zap className="w-4 h-4" style={{ color: modeConfig.color }} />
            </div>
            <p className="text-xs text-zinc-400 font-mono text-center">{modeConfig.desc}</p>
            <motion.div
              className="h-1 rounded-full w-48"
              style={{ background: modeConfig.color + '25' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: modeConfig.color }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
