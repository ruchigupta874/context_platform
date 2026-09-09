import { CONFIDENCE_BANDS, ORG_NAMESPACE, TONE } from '@/config/constants/common';
import { SIGNAL_BANDS } from '@/features/review';

/** Confidence always reads to two places — 0.9 and 0.90 must not look different. */
export const formatConfidence = (value) => value.toFixed(2);

export const formatPercent = (value, total) =>
  total === 0 ? '0%' : `${Math.round((value / total) * 100)}%`;

export const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

/** Which colour family a confidence score belongs to. */
export const confidenceTone = (value) =>
  CONFIDENCE_BANDS.find((band) => value >= band.min)?.tone ?? TONE.danger;

export const signalTone = (weight) =>
  SIGNAL_BANDS.find((band) => weight >= band.min)?.tone ?? TONE.danger;

/**
 * An absolute timestamp from the API, in the reader's own locale.
 *
 * Absolute rather than relative on purpose: these appear next to ids in a
 * provenance block, where the reader is reconciling a record against something
 * else. "3 days ago" cannot be matched against a log line.
 */
export const formatDateTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const conceptIri = (workspaceId, name) => `${ORG_NAMESPACE}/ontology/${workspaceId}#${name}`;

export const entityIri = (workspaceId, type, label) =>
  `${ORG_NAMESPACE}/id/${type.toLowerCase()}/${label.replace(/\s+/g, '-').toLowerCase()}`;

/** "Customer holds Contract" — the human-readable form of a triple. */
export const relationLabel = (relation) =>
  `${relation.subject} ${relation.predicate} ${relation.object}`;

/** Joins non-empty fragments with the middot the design uses throughout. */
export const joinMeta = (...parts) => parts.filter(Boolean).join(' · ');
