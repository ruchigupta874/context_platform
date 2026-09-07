import { SOURCE_STATE } from '@/features/sources/constants';
import { TONE } from '@/config/constants/common';

/**
 * What the Status column says about one source.
 *
 * `activeRun` is set by the mock for a source an extraction is already reading;
 * `triggeredIds` holds the ones triggered in this session. Both mean the same
 * thing to the reader, so they resolve to the same state.
 */
export function sourceStatus(source, triggeredIds) {
  if (source.activeRun || triggeredIds.has(source.id)) return SOURCE_STATE.triggered;
  if (source.indexed === false) return SOURCE_STATE.indexing;
  if (!source.lastRun) return SOURCE_STATE.never;
  if (source.drift) return { ...SOURCE_STATE.drifted, label: source.drift };
  return SOURCE_STATE.extracted;
}

/**
 * A source can only be extracted once at a time, and a document still being
 * indexed has nothing to read yet.
 */
export function canExtract(source, triggeredIds) {
  return (
    sourceStatus(source, triggeredIds).id !== SOURCE_STATE.triggered.id && source.indexed !== false
  );
}

/** Label on the row action — re-running an already-extracted source reads differently. */
export function extractLabel(source, triggeredIds) {
  const state = sourceStatus(source, triggeredIds);
  if (state.id === SOURCE_STATE.triggered.id) return 'Triggered';
  return source.lastRun ? 'Re-extract' : 'Run extraction';
}

/**
 * The four figures above the list.
 *
 * These count raw fields rather than resolved states on purpose: a document
 * that is still indexing has usually also drifted, and the reader wants both
 * facts rather than whichever one the Status column happens to win.
 */
export function sourceCounts(sources) {
  return {
    total: sources.length,
    extracted: sources.filter((source) => source.lastRun && !source.drift).length,
    drifted: sources.filter((source) => Boolean(source.drift)).length,
    notExtracted: sources.filter((source) => !source.lastRun).length,
  };
}

/**
 * The same four figures as display rows. `totalLabel` names what is being
 * counted — the tab decides whether that is tables or documents.
 *
 * Only drift carries a tone on its number: it is the only one of the four that
 * is a problem rather than a fact.
 */
export function sourceStats(sources, totalLabel) {
  const counts = sourceCounts(sources);
  return [
    { id: 'total', label: totalLabel, value: counts.total, tone: TONE.accent },
    { id: 'extracted', label: 'Extracted', value: counts.extracted, tone: TONE.ok },
    { id: 'drifted', label: 'Drifted', value: counts.drifted, tone: TONE.warn },
    { id: 'notExtracted', label: 'Not extracted', value: counts.notExtracted, tone: TONE.neutral },
  ];
}
