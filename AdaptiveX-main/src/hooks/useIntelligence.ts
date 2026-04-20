import { useState, useCallback } from 'react';

export type SectionId = 'hero' | 'media' | 'dashboard' | 'analytics' | 'intelligence';

interface InteractionRecord {
  clicks: number;
  hovers: number;
  timeMs: number;
}

export function useIntelligence() {
  const [interactions, setInteractions] = useState<Record<SectionId, InteractionRecord>>({
    hero:         { clicks: 0, hovers: 0, timeMs: 0 },
    media:        { clicks: 0, hovers: 0, timeMs: 0 },
    dashboard:    { clicks: 0, hovers: 0, timeMs: 0 },
    analytics:    { clicks: 0, hovers: 0, timeMs: 0 },
    intelligence: { clicks: 0, hovers: 0, timeMs: 0 },
  });
  const [preloadingSection, setPreloadingSection] = useState<SectionId | null>(null);
  const [lastPrediction, setLastPrediction] = useState<SectionId | null>(null);

  const trackClick = useCallback((id: SectionId) => {
    setInteractions(prev => ({
      ...prev,
      [id]: { ...prev[id], clicks: prev[id].clicks + 1 },
    }));
  }, []);

  const trackHover = useCallback((id: SectionId) => {
    setInteractions(prev => ({
      ...prev,
      [id]: { ...prev[id], hovers: prev[id].hovers + 1 },
    }));

    // Predict next likely section and preload it
    const nextMap: Record<SectionId, SectionId> = {
      hero:         'media',
      media:        'dashboard',
      dashboard:    'analytics',
      analytics:    'intelligence',
      intelligence: 'hero',
    };
    const predicted = nextMap[id];
    if (predicted !== lastPrediction) {
      setLastPrediction(predicted);
      setPreloadingSection(predicted);
      setTimeout(() => setPreloadingSection(null), 1800);
    }
  }, [lastPrediction]);

  const trackTime = useCallback((id: SectionId, ms: number) => {
    setInteractions(prev => ({
      ...prev,
      [id]: { ...prev[id], timeMs: prev[id].timeMs + ms },
    }));
  }, []);

  // Score each section (higher = more interacted)
  const scores = Object.entries(interactions).map(([id, rec]) => ({
    id: id as SectionId,
    score: rec.clicks * 3 + rec.hovers * 1 + Math.floor(rec.timeMs / 1000) * 2,
  })).sort((a, b) => b.score - a.score);

  const topSection = scores[0].score > 0 ? scores[0].id : null;

  return {
    interactions,
    preloadingSection,
    topSection,
    scores,
    trackClick,
    trackHover,
    trackTime,
  };
}
