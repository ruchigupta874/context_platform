import { CONFIDENCE_BANDS, DECISION, TONE } from '@/config/constants/common';

/**
 * The concept review gate, as the API describes it.
 *
 * The endpoint returns one envelope per item type — a total, a count per status
 * and the items themselves — and every item carries a `payload` of loosely
 * typed strings. This module is the only place that knows that shape: it turns
 * a response item into the object the screen renders, so when the fetcher lands
 * nothing above it has to change.
 *
 * Everything the table filters and sorts by lives here too, as pure functions
 * over normalised concepts. The page holds the current filter; it does not know
 * what a filter means.
 */

/** The statuses the API reports. An item is in exactly one of them. */
export const REVIEW_STATUS = {
  pending: 'PENDING',
  approved: 'APPROVED',
  rejected: 'REJECTED',
};

/** `item_type` on the envelope. Concepts and relationships are separate gates. */
export const REVIEW_ITEM_TYPE = {
  concept: 'CONCEPT',
  relationship: 'RELATIONSHIP',
};

/**
 * API status to the decision the gate holds.
 *
 * PENDING deliberately maps to nothing: undecided is not a third decision, it
 * is the absence of one, and the gate has to be able to count it as such.
 */
export const DECISION_BY_STATUS = {
  [REVIEW_STATUS.approved]: DECISION.approved,
  [REVIEW_STATUS.rejected]: DECISION.rejected,
};

/** Which slice of the gate the table is showing. */
export const CONCEPT_FILTER = {
  all: 'all',
  undecided: 'undecided',
  approved: DECISION.approved,
  rejected: DECISION.rejected,
};

export const CONCEPT_FILTERS = [
  { id: CONCEPT_FILTER.all, label: 'All statuses' },
  { id: CONCEPT_FILTER.undecided, label: 'Undecided' },
  { id: CONCEPT_FILTER.approved, label: 'Approved' },
  { id: CONCEPT_FILTER.rejected, label: 'Rejected' },
];

/**
 * How the Status column reads, keyed by the decision held — with undecided as
 * the absent one. Neutral rather than amber: on arrival every row is undecided,
 * and a table of fifty amber chips says "all of this is wrong" instead of
 * "none of this has been looked at".
 */
export const CONCEPT_STATUS_META = {
  [CONCEPT_FILTER.undecided]: { label: 'Undecided', tone: TONE.neutral, icon: 'clock' },
  [DECISION.approved]: { label: 'Approved', tone: TONE.ok, icon: 'check' },
  [DECISION.rejected]: { label: 'Rejected', tone: TONE.danger, icon: 'close' },
};

export const statusMetaFor = (decision) =>
  CONCEPT_STATUS_META[decision ?? CONCEPT_FILTER.undecided];

/** `decision` is undefined for an item nobody has ruled on yet. */
export function matchesFilter(filter, decision) {
  if (filter === CONCEPT_FILTER.all) return true;
  if (filter === CONCEPT_FILTER.undecided) return !decision;
  return decision === filter;
}

/** The confidence band a score falls in — the same bands that colour the chip. */
const bandOf = (value) =>
  CONFIDENCE_BANDS.find((band) => value >= band.min) ??
  CONFIDENCE_BANDS[CONFIDENCE_BANDS.length - 1];

export const CONFIDENCE_FILTER = { all: 'all' };

/**
 * Built from the bands rather than listed again, so a band added to the scale
 * appears in this menu without anyone remembering to add it.
 */
export const CONFIDENCE_FILTERS = [
  { id: CONFIDENCE_FILTER.all, label: 'All confidence' },
  ...CONFIDENCE_BANDS.map((band) => ({
    id: band.label,
    label: `${band.label[0].toUpperCase()}${band.label.slice(1)} confidence`,
  })),
];

export const matchesConfidence = (filter, value) =>
  filter === CONFIDENCE_FILTER.all || bandOf(value).label === filter;

export const CONCEPT_SORT = {
  nameAsc: 'name-asc',
  nameDesc: 'name-desc',
  confidenceDesc: 'confidence-desc',
  confidenceAsc: 'confidence-asc',
  type: 'type',
};

export const CONCEPT_SORTS = [
  { id: CONCEPT_SORT.nameAsc, label: 'Concept (A–Z)' },
  { id: CONCEPT_SORT.nameDesc, label: 'Concept (Z–A)' },
  { id: CONCEPT_SORT.confidenceDesc, label: 'Confidence (high first)' },
  { id: CONCEPT_SORT.confidenceAsc, label: 'Confidence (low first)' },
  { id: CONCEPT_SORT.type, label: 'Class / type' },
];

/** Ties break on name, so a sort by type or confidence is still stable to read. */
const BY_SORT = {
  [CONCEPT_SORT.nameAsc]: (a, b) => a.name.localeCompare(b.name),
  [CONCEPT_SORT.nameDesc]: (a, b) => b.name.localeCompare(a.name),
  [CONCEPT_SORT.confidenceDesc]: (a, b) =>
    b.confidence - a.confidence || a.name.localeCompare(b.name),
  [CONCEPT_SORT.confidenceAsc]: (a, b) =>
    a.confidence - b.confidence || a.name.localeCompare(b.name),
  [CONCEPT_SORT.type]: (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name),
};

export const sortConcepts = (concepts, sort) => [...concepts].sort(BY_SORT[sort]);

/**
 * Aliases arrive as a JSON-encoded array inside a string field, not as an
 * array. Anything that does not parse is treated as no aliases rather than
 * thrown: one malformed row should not take the gate down.
 */
export function parseAliases(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((alias) => typeof alias === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * One response item, flattened into what the screen actually reads.
 *
 * Confidence is taken from the item rather than the payload copy of it: the
 * payload's is a string, and a score the table sorts and colours by should be a
 * number everywhere above this line.
 */
export function normalizeConcept(item) {
  const payload = item.payload ?? {};
  return {
    id: item.item_ref_id,
    name: payload.canonical_name,
    aliases: parseAliases(payload.aliases),
    type: payload.type,
    role: payload.ontology_role,
    definition: payload.definition,
    confidence: Number(item.confidence ?? payload.confidence ?? 0),
    status: item.status,
    reviewedBy: item.reviewed_by_id,
    reviewedAt: item.reviewed_at,
    comment: item.review_comment,
    conceptId: payload.canonical_concept_id,
    runId: payload.execution_run_id,
    createdAt: payload.created_at,
  };
}

/**
 * The decisions the API has already recorded, as the gate's decision map.
 *
 * Seeding from the response is what makes a reopened gate show the work someone
 * already did, rather than presenting every item as untouched.
 */
export function seedDecisions(items) {
  return items.reduce((acc, item) => {
    const decision = DECISION_BY_STATUS[item.status];
    if (decision) acc[item.item_ref_id] = decision;
    return acc;
  }, {});
}

/** How many items sit behind each status filter, given the decisions held now. */
export function countByFilter(items, decisionFor) {
  return CONCEPT_FILTERS.reduce((acc, filter) => {
    acc[filter.id] = items.filter((item) => matchesFilter(filter.id, decisionFor(item.id))).length;
    return acc;
  }, {});
}

/** Free-text search across everything a reviewer would type looking for a concept. */
export function conceptMatches(concept, needle) {
  return [concept.name, concept.type, concept.role, concept.definition, ...concept.aliases]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(needle));
}
