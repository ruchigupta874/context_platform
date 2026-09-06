import { CONFIDENCE_BANDS, ORG_NAMESPACE, TONE } from '@/config/constants/common';
import { SIGNAL_BANDS } from '@/config/constants/review';

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

export const conceptIri = (workspaceId, name) => `${ORG_NAMESPACE}/ontology/${workspaceId}#${name}`;

export const entityIri = (workspaceId, type, label) =>
  `${ORG_NAMESPACE}/id/${type.toLowerCase()}/${label.replace(/\s+/g, '-').toLowerCase()}`;

/** "Customer holds Contract" — the human-readable form of a triple. */
export const relationLabel = (relation) =>
  `${relation.subject} ${relation.predicate} ${relation.object}`;

/** Joins non-empty fragments with the middot the design uses throughout. */
export const joinMeta = (...parts) => parts.filter(Boolean).join(' · ');
