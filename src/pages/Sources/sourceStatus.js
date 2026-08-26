import { SOURCE_STATE } from '../../config/constants/sources';

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
  return sourceStatus(source, triggeredIds).id !== 'triggered' && source.indexed !== false;
}

/** Label on the row action — re-running an already-extracted source reads differently. */
export function extractLabel(source, triggeredIds) {
  const state = sourceStatus(source, triggeredIds);
  if (state.id === 'triggered') return 'Triggered';
  return source.lastRun ? 'Re-extract' : 'Run extraction';
}
