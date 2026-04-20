import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Smartphone, Monitor, Tablet, Wifi, WifiOff, Zap } from 'lucide-react';
import { useAdaptive } from '../context/AdaptiveContext';
import { cn } from '../utils/cn';

const SPEED_LABELS: Record<string, string> = {
  fast: '4G / WiFi',
  medium: '3G',
  slow: '2G / Slow',
  offline: 'Offline',
};

export const SystemStatus = () => {
  const { networkSpeed, deviceType, activeMode } = useAdaptive();
  const [modeFlash, setModeFlash] = useState(false);
  const prevRef = useRef(activeMode);

  if (prevRef.current !== activeMode) {
    prevRef.current = activeMode;
    setModeFlash(true);
    setTimeout(() => setModeFlash(false), 800);
  }

  const DeviceIcon = deviceType === 'mobile' ? Smartphone : deviceType === 'tablet' ? Tablet : Monitor;
  const NetIcon = networkSpeed === 'offline' ? WifiOff : Wifi;

  const speedColor = {
    fast:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    medium:  'text-amber-400  bg-amber-400/10  border-amber-400/20',
    slow:    'text-red-400    bg-red-400/10    border-red-400/20',
    offline: 'text-zinc-500   bg-zinc-500/10   border-zinc-500/20',
  }[networkSpeed];

  const modeColor = {
    quality:     'text-violet-400 bg-violet-400/10 border-violet-400/20',
    balanced:    'text-blue-400   bg-blue-400/10   border-blue-400/20',
    performance: 'text-brand-400  bg-brand-400/10  border-brand-400/20',
  }[activeMode];

  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 glass-strong px-3 py-2 rounded-full shadow-xl"
    >
      {/* Live dot */}
      <div className="relative flex items-center gap-1.5 pr-3 border-r border-white/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Live</span>
      </div>

      {/* Network Speed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={networkSpeed}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.25 }}
          className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider', speedColor)}
        >
          <NetIcon className="w-3 h-3" />
          {SPEED_LABELS[networkSpeed]}
        </motion.div>
      </AnimatePresence>

      {/* Device */}
      <AnimatePresence mode="wait">
        <motion.div
          key={deviceType}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold text-zinc-300 uppercase tracking-wider"
        >
          <DeviceIcon className="w-3 h-3" />
          {deviceType}
        </motion.div>
      </AnimatePresence>

      {/* Mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, scale: 0.85, x: 10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider transition-all',
            modeColor,
            modeFlash && 'ring-2 ring-current ring-offset-1 ring-offset-black'
          )}
        >
          <Zap className="w-3 h-3" />
          {activeMode} mode
          {modeFlash && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-1 font-mono text-[9px] opacity-70"
            >
              ↻ applied
            </motion.span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Activity icon */}
      <Activity className="w-3.5 h-3.5 text-zinc-600 ml-1" />
    </motion.div>
  );
};
