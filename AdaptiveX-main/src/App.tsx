import { useEffect, useRef, useState } from 'react';
import { AdaptiveProvider, useAdaptive } from './context/AdaptiveContext';
import { SystemStatus } from './components/SystemStatus';
import { ControlPanel } from './components/NetworkSimulator';
import { HeroSection } from './components/HeroSection';
import { DashboardPreview } from './components/DashboardPreview';
import { AnalyticsWidget } from './components/AnalyticsWidget';
import { AdaptiveMedia } from './components/AdaptiveMedia';
import { IntelligencePanel } from './components/IntelligencePanel';
import { ModeTransitionOverlay } from './components/ModeTransitionOverlay';
import { useIntelligence } from './hooks/useIntelligence';
import { useMousePosition } from './hooks/useMousePosition';

// ── Inner app (has access to adaptive context) ───────────────
function AppContent() {
  const { activeMode, animationsEnabled } = useAdaptive();
  const mouse = useMousePosition();
  const intel = useIntelligence();

  // Mode transition overlay
  const [showModeOverlay, setShowModeOverlay] = useState(false);
  const prevMode = useRef(activeMode);

  useEffect(() => {
    if (prevMode.current !== activeMode) {
      prevMode.current = activeMode;
      setShowModeOverlay(true);
      const t = setTimeout(() => setShowModeOverlay(false), 1200);
      return () => clearTimeout(t);
    }
  }, [activeMode]);

  // Ticker items
  const tickerItems = [
    '⚡ Performance Mode Active',
    '🌐 Network Signal: Adaptive',
    '🧠 Intelligence Engine: Online',
    '📡 Predictive Preloading: Enabled',
    '✦ 4K Assets: Conditional',
    '↻ Real-Time Layout Morphing',
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Fixed global background */}
      <div className="fixed inset-0 bg-[#070707] grid-bg z-[-2]" />

      {/* Cursor glow — quality/balanced only */}
      {animationsEnabled && (
        <div
          id="cursor-glow"
          style={{ left: mouse.x, top: mouse.y }}
        />
      )}

      {/* Fixed UI chrome */}
      <SystemStatus />
      <ControlPanel topSection={intel.topSection} />

      {/* Mode transition flash */}
      <ModeTransitionOverlay show={showModeOverlay} mode={activeMode} />

      {/* Ticker bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-8 bg-black/70 backdrop-blur-md border-t border-white/5 overflow-hidden flex items-center">
        <div className="flex items-center gap-0 animate-ticker whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-[10px] font-mono text-zinc-600 px-8">{item}</span>
          ))}
        </div>
      </div>

      {/* Page content */}
      <main className="pb-24">
        {/* Hero */}
        <HeroSection onInteract={intel.trackHover} />

        {/* Section divider */}
        <SectionDivider />

        {/* Adaptive Media */}
        <div className="py-20">
          <AdaptiveMedia onInteract={intel.trackHover} />
        </div>

        <SectionDivider />

        {/* Dashboard Preview */}
        <div className="py-20">
          <DashboardPreview
            topSection={intel.topSection}
            preloadingSection={intel.preloadingSection}
            onInteract={(id) => { intel.trackHover(id); intel.trackClick(id); }}
          />
        </div>

        <SectionDivider />

        {/* Analytics */}
        <div className="py-20">
          <AnalyticsWidget
            onInteract={(id) => { intel.trackHover(id); intel.trackClick(id); }}
            topSection={intel.topSection}
          />
        </div>

        <SectionDivider />

        {/* Intelligence Panel */}
        <div className="py-20">
          <IntelligencePanel
            scores={intel.scores}
            interactions={intel.interactions}
            topSection={intel.topSection}
            preloadingSection={intel.preloadingSection}
            onInteract={intel.trackHover}
          />
        </div>

        {/* Footer */}
        <footer className="text-center py-16 text-zinc-700 text-xs font-mono border-t border-white/5 mt-12">
          <div className="text-brand-600 font-bold text-lg mb-2">AdaptiveX</div>
          Intelligent Content Delivery Interface · Built for Hackathon 2026 · Frontend Only
        </footer>
      </main>
    </div>
  );
}

const SectionDivider = () => (
  <div className="w-full max-w-5xl mx-auto px-4">
    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

// ── Root ─────────────────────────────────────────────────────
export default function App() {
  return (
    <AdaptiveProvider>
      <AppContent />
    </AdaptiveProvider>
  );
}
