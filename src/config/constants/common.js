/** Tone names map to CSS classes and to the semantic token families in tokens.css. */
export const TONE = {
  neutral: 'neutral',
  ok: 'ok',
  warn: 'warn',
  danger: 'danger',
  info: 'info',
  accent: 'accent',
};

/** A decision a reviewer can make at a gate. `undefined` means "not yet decided". */
export const DECISION = {
  approved: 'approved',
  rejected: 'rejected',
};

/**
 * Confidence bands. The gate colours a score by band rather than by a gradient,
 * because reviewers act on "is this safe" not on two decimal places.
 */
export const CONFIDENCE_BANDS = [
  { min: 0.85, tone: TONE.ok, label: 'high' },
  { min: 0.7, tone: TONE.warn, label: 'medium' },
  { min: 0, tone: TONE.danger, label: 'low' },
];

export const DENSITY = {
  comfortable: 'comfortable',
  compact: 'compact',
};

export const ORG_NAMESPACE = 'https://ctx.internal';
