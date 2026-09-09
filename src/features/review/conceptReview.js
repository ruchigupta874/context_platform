import { DECISION } from '@/config/constants/common';

/**
 * The concept review gate, as the API describes it.
 *
 * The endpoint returns one envelope per item type — a total, a count per status
 * and the items themselves — and every item carries a `payload` of loosely
 * typed strings. This module is the only place that knows that shape: it turns
 * a response item into the object the screen renders, so when the fetcher lands
 * nothing above it has to change.
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
 * is the absence of one, and the footer has to be able to count it as such.
 */
export const DECISION_BY_STATUS = {
  [REVIEW_STATUS.approved]: DECISION.approved,
  [REVIEW_STATUS.rejected]: DECISION.rejected,
};

/** Which slice of the gate the list is showing. */
export const CONCEPT_FILTER = {
  all: 'all',
  pending: 'pending',
  approved: DECISION.approved,
  rejected: DECISION.rejected,
};

export const CONCEPT_FILTERS = [
  { id: CONCEPT_FILTER.all, label: 'All' },
  { id: CONCEPT_FILTER.pending, label: 'Pending' },
  { id: CONCEPT_FILTER.approved, label: 'Approved' },
  { id: CONCEPT_FILTER.rejected, label: 'Rejected' },
];

/** `decision` is undefined for an item nobody has ruled on yet. */
export function matchesFilter(filter, decision) {
  if (filter === CONCEPT_FILTER.all) return true;
  if (filter === CONCEPT_FILTER.pending) return !decision;
  return decision === filter;
}

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
 * payload's is a string, and a score the list sorts and colours by should be a
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

/** How many items sit behind each filter, given the decisions held right now. */
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
