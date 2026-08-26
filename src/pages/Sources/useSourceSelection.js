import { useMemo } from 'react';
import { SOURCE_STATE } from '../../config/constants/sources';

/**
 * Derives everything the Sources screen needs to talk about re-extraction.
 *
 * The important distinction is between a source that has never been extracted
 * and one that has drifted since it was: the first needs a new run, the second
 * needs an update to the existing ontology. Collapsing them into "selected"
 * is what made the original screen unable to offer a re-extract path at all.
 */
export function sourceState(source) {
  if (!source.lastRun) return { ...SOURCE_STATE.never };
  if (source.drift) return { ...SOURCE_STATE.drifted, label: source.drift };
  return { ...SOURCE_STATE.upToDate };
}

export function useSourceInsights(sources, selectedIds) {
  return useMemo(() => {
    const selected = sources.filter((source) => selectedIds.includes(source.id));
    const drifted = sources.filter((source) => Boolean(source.drift));
    const alreadyExtracted = selected.filter((source) => Boolean(source.lastRun));
    const neverExtracted = selected.filter((source) => !source.lastRun);
    const selectedDrifted = selected.filter((source) => Boolean(source.drift));

    const parts = [];
    if (alreadyExtracted.length) parts.push(`${alreadyExtracted.length} already in v5`);
    if (neverExtracted.length) parts.push(`${neverExtracted.length} never extracted`);
    if (selectedDrifted.length) parts.push(`${selectedDrifted.length} changed since`);

    return {
      selected,
      drifted,
      alreadyExtracted,
      neverExtracted,
      breakdown: parts.length ? parts.join(' · ') : 'Nothing selected',
      /** Updating in place only makes sense if something selected is already mapped. */
      canUpdate: alreadyExtracted.length > 0,
      driftSummary: drifted.map((source) => `${source.name} ${source.drift}`).join(', '),
    };
  }, [sources, selectedIds]);
}
