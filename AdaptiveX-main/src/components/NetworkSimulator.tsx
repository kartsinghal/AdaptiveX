import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Settings2, Wifi, Cpu, RotateCcw, CheckCircle, GripHorizontal, Sparkles } from 'lucide-react';
import { useAdaptive } from '../context/AdaptiveContext';
import type { AdaptiveMode, NetworkSpeed } from '../context/AdaptiveContext';
import { cn } from '../utils/cn';

const NET_OPTIONS: { label: string; value: NetworkSpeed; color: string }[] = [
  { label: '4G', value: 'fast',   color: 'emerald' },
  { label: '3G', value: 'medium', color: 'amber'   },
  { label: '2G', value: 'slow',   color: 'red'     },
];

const MODE_OPTIONS: { label: string; value: AdaptiveMode; desc: string }[] = [
  { label: 'Auto',        value: 'auto',        desc: 'Smart detection' },
  { label: 'Performance', value: 'performance', desc: 'Save data'        },
  { label: 'Balanced',    value: 'balanced',    desc: 'Best of both'    },
  { label: 'Quality',     value: 'quality',     desc: 'Full richness'   },
];

export const ControlPanel = ({ topSection }: { topSection?: string | null }) => {
  const { mode, activeMode, simulatedNetwork, setMode, setSimulatedNetwork } = useAdaptive();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  
  // Smart visibility tracking
  const [idle, setIdle] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();

  const dragControls = useDragControls();

  // Load position from local storage
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('adaptive-engine-pos');
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  // Track inactivity and scroll
  useEffect(() => {
    const resetIdle = () => {
      setIdle(false);
      clearTimeout(idleTimer.current);
      if (isExpanded) return; // Don't auto-hide if open
      idleTimer.current = setTimeout(() => setIdle(true), 4000);
    };

    const handleScroll = () => {
      resetIdle();
      if (isExpanded) setIsExpanded(false); // Hide on scroll
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('scroll', handleScroll);
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(idleTimer.current);
    };
  }, [isExpanded]);

  // Context-aware hint
  useEffect(() => {
    if (topSection === 'analytics' || topSection === 'intelligence') {
      setHint('System optimizing based on activity');
      setIsExpanded(true); // Gently expand to suggest
      const t = setTimeout(() => {
        setIsExpanded(false);
        setHint(null);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [topSection]);

  const handleNetworkChange = (speed: NetworkSpeed) => {
    const next = simulatedNetwork === speed ? null : speed;
    setSimulatedNetwork(next);
    triggerOptimizing();
  };

  const handleModeChange = (m: AdaptiveMode) => {
    setMode(m);
    triggerOptimizing();
  };

  const triggerOptimizing = () => {
    setOptimized(false);
    setIsOptimizing(true);
    // Expand to show feedback
    setIsExpanded(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimized(true);
      setTimeout(() => {
        setOptimized(false);
        setIsExpanded(false); // auto collapse
      }, 2000);
    }, 1200);
  };

  const onDragEnd = (_: any, info: any) => {
    const newPos = {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y
    };
    setPosition(newPos);
    localStorage.setItem('adaptive-engine-pos', JSON.stringify(newPos));
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isExpanded && !target.closest('#adaptive-engine')) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  return (
    <>
      {/* Backdrop blur when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        id="adaptive-engine"
        drag
        dragControls={dragControls}
        dragListener={false} // Only drag by handle
        dragMomentum={false}
        onDragEnd={onDragEnd}
        animate={{ x: position.x, y: position.y, opacity: idle && !isExpanded ? 0.4 : 1 }}
        style={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed z-50 flex flex-col items-end transition-all duration-300",
          "bottom-16 right-6" // default spawn point
        )}
        onMouseEnter={() => setIdle(false)} // Reveal near edge
      >
        <AnimatePresence mode="sync">
          {!isExpanded ? (
            // Minimized Smart Button
            <motion.button
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsExpanded(true)}
              className="relative group p-3 glass-strong rounded-full shadow-xl shadow-brand-500/20 border border-brand-500/30 card-hover flex items-center gap-2"
            >
              {/* Notification dot */}
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5 -mt-1 -mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
              </span>
              
              <Settings2 className="w-5 h-5 text-brand-400 group-hover:rotate-90 transition-transform duration-500" />
              
              <AnimatePresence>
                {hint && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden whitespace-nowrap text-xs font-medium text-brand-300 pr-1"
                  >
                    {hint}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            // Expanded Panel
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.2 }}
              className="glass-strong p-5 rounded-3xl w-[320px] shadow-[0_0_80px_-15px_rgba(245,92,0,0.3)] flex flex-col gap-4 border border-brand-500/30"
            >
              {/* Drag Handle & Header */}
              <div className="flex items-center gap-2">
                <div 
                  className="p-1.5 rounded-lg bg-brand-500/15 border border-brand-500/20 cursor-grab active:cursor-grabbing"
                  onPointerDown={(e) => dragControls.start(e)}
                >
                  <GripHorizontal className="w-4 h-4 text-brand-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-1">
                    Adaptive Engine <Sparkles className="w-3 h-3 text-brand-400" />
                  </h3>
                  <p className="text-[10px] text-zinc-500">Intelligent system assistant</p>
                </div>
                {/* Status indicator */}
                <AnimatePresence mode="wait">
                  {isOptimizing ? (
                    <motion.div key="opt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-1 text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-1 rounded-full">
                      <RotateCcw className="w-3 h-3 animate-spin" /> Optimizing
                    </motion.div>
                  ) : optimized ? (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Applied
                    </motion.div>
                  ) : (
                    <motion.button key="idle" 
                      onClick={() => setIsExpanded(false)}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="p-1.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                    >
                      ✕
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Optimizing overlay message */}
              <AnimatePresence>
                {isOptimizing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 text-[11px] text-amber-300 font-mono flex items-center gap-2">
                      <RotateCcw className="w-3 h-3 animate-spin shrink-0" />
                      Switching to {activeMode} mode…
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Network Simulation */}
              <div className="space-y-2 relative group">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                  <Wifi className="w-3.5 h-3.5" /> Simulate Network
                </div>
                <div className="flex gap-1.5">
                  {NET_OPTIONS.map(({ label, value, color }) => (
                    <button
                      key={value}
                      onClick={() => handleNetworkChange(value)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border transform active:scale-95',
                        simulatedNetwork === value
                          ? `bg-${color}-500/20 text-${color}-300 border-${color}-500/40 shadow-lg glow-sm`
                          : 'bg-white/5 text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/10'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                  {simulatedNetwork && (
                    <button
                      onClick={() => { setSimulatedNetwork(null); triggerOptimizing(); }}
                      className="px-2 py-2 rounded-xl text-xs text-zinc-500 hover:text-white border border-transparent hover:border-white/10 transition-all active:scale-95"
                      title="Reset to real connection"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-[9px] text-zinc-600 font-mono">
                  {simulatedNetwork ? `⚡ Simulating ${simulatedNetwork} · overrides signal` : '↳ Using real browser network'}
                </p>
              </div>

              {/* Mode Override */}
              <div className="space-y-2 pt-3 border-t border-white/5 relative group">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                  <Cpu className="w-3.5 h-3.5" /> Intelligence Mode
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {MODE_OPTIONS.map(({ label, value, desc }) => (
                    <button
                      key={value}
                      onClick={() => handleModeChange(value)}
                      className={cn(
                        'flex flex-col items-start px-3 py-2.5 rounded-xl text-left transition-all duration-200 border transform active:scale-95 group/btn',
                        mode === value
                          ? 'bg-brand-500/15 border-brand-500/30 text-white glow-sm'
                          : 'bg-white/5 border-transparent text-zinc-500 hover:bg-white/10 hover:text-zinc-300 hover:border-white/10'
                      )}
                    >
                      <span className="text-xs font-semibold flex items-center justify-between w-full">
                        {label}
                        {mode === value && <motion.div layoutId="mode-dot" className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
                      </span>
                      <span className="text-[9px] opacity-60 mt-0.5 group-hover/btn:opacity-100 transition-opacity">{desc}</span>
                    </button>
                  ))}
                </div>

                {/* Active mode indicator */}
                <div className="flex justify-between items-center px-1 pt-1">
                  <span className="text-[9px] text-zinc-600 font-mono uppercase">Active Profile</span>
                  <motion.span
                    key={activeMode}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold font-mono text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded-full"
                  >
                    → {activeMode}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
