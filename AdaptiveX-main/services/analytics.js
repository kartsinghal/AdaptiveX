import { SECTIONS } from './store.js';

/**
 * Derives insights from a session object.
 */
function buildInsights(session) {
  const { sectionCounts, sectionTime } = session;

  // most active by click/hover/scroll count
  const mostActiveSection = SECTIONS.reduce((a, b) =>
    sectionCounts[a] >= sectionCounts[b] ? a : b
  );

  // recommended = highest weighted score (70 % count + 30 % time)
  const totalCount = Object.values(sectionCounts).reduce((s, v) => s + v, 0) || 1;
  const totalTime  = Object.values(sectionTime).reduce((s, v) => s + v, 0) || 1;

  const scored = SECTIONS.map((s) => ({
    section: s,
    score: Math.round(
      0.7 * (sectionCounts[s] / totalCount) * 100 +
      0.3 * (sectionTime[s]  / totalTime)  * 100
    ),
  }));

  const recommendedSection = scored.sort((a, b) => b.score - a.score)[0].section;

  return {
    mostActiveSection,
    interactionScore: { ...sectionCounts },
    timeSpentMs: { ...sectionTime },
    recommendedSection,
  };
}

/**
 * Simple Markov-style prediction:
 * look at last events and return the section that follows most often.
 */
function predictNext(session) {
  const { interactions, sectionCounts } = session;

  // build transition counts from interaction history
  const transitions = {};
  for (let i = 0; i < interactions.length - 1; i++) {
    const from = interactions[i].section;
    const to   = interactions[i + 1].section;
    if (!transitions[from]) transitions[from] = {};
    transitions[from][to] = (transitions[from][to] || 0) + 1;
  }

  const lastSection = session.lastSection;

  // if we have transitions from the last section, use them
  if (lastSection && transitions[lastSection]) {
    const candidates = transitions[lastSection];
    const nextLikelySection = Object.keys(candidates).reduce((a, b) =>
      candidates[a] >= candidates[b] ? a : b
    );
    return { nextLikelySection, confidence: 'high' };
  }

  // fallback: section with most interactions (excluding current)
  const fallback = SECTIONS.filter((s) => s !== lastSection).reduce((a, b) =>
    sectionCounts[a] >= sectionCounts[b] ? a : b
  );
  return { nextLikelySection: fallback, confidence: 'low' };
}

export { buildInsights, predictNext };
