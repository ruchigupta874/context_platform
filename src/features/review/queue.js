import { CONFIDENCE_BANDS } from '@/config/constants/common';
import { COVERAGE } from '@/features/review/questions';
import { PROPOSAL_RUN } from '@/features/review/constants';
import { CONCEPT_REVIEW } from '@/features/review/conceptMocks';
import { normalizeConcept } from '@/features/review/conceptReview';
import { RELATIONSHIP_REVIEW } from '@/features/review/relationshipMocks';
import { normalizeRelationship, relationshipLabel } from '@/features/review/relationshipReview';
import { QUESTION_RUN, QUESTIONS } from '@/features/review/questionMocks';
import { joinMeta } from '@/utils/format';

/** Above this band an item is safe to wave through from a one-line summary. */
const HIGH_CONFIDENCE = CONFIDENCE_BANDS[0].min;

export const QUEUE_KINDS = [
  { id: 'all', label: 'All' },
  { id: 'concept', label: 'Concepts' },
  { id: 'relation', label: 'Relationships' },
  { id: 'question', label: 'Questions' },
];

/**
 * Every decision waiting across every run, flattened into one list.
 *
 * The gates own one run each and show an item's full evidence. This is the
 * other half: everything at once, summarised to a line. `decidable` is the
 * line between them — an item you cannot judge from a summary is not offered
 * here, it is sent to the gate that can show you why it is uncertain.
 */
export const QUEUE_ITEMS = [
  ...CONCEPT_REVIEW.items.map(normalizeConcept).map((concept) => ({
    id: concept.id,
    runId: PROPOSAL_RUN,
    gate: 'concepts',
    kind: 'concept',
    name: concept.name,
    sub: joinMeta(concept.type, concept.role.toLowerCase()),
    score: concept.confidence,
    scoreLabel: concept.confidence.toFixed(2),
    decidable: concept.confidence >= HIGH_CONFIDENCE,
  })),
  ...RELATIONSHIP_REVIEW.items.map(normalizeRelationship).map((relationship) => ({
    id: relationship.id,
    runId: PROPOSAL_RUN,
    gate: 'relationships',
    kind: 'relation',
    name: relationshipLabel(relationship),
    sub: joinMeta(relationship.cardinality, relationship.role),
    score: relationship.confidence,
    scoreLabel: relationship.confidence.toFixed(2),
    decidable: relationship.confidence >= HIGH_CONFIDENCE,
  })),
  ...QUESTIONS.map((question) => ({
    id: question.id,
    runId: QUESTION_RUN,
    gate: 'questions',
    kind: 'question',
    name: question.text,
    sub: `${question.theme} · ${question.origin}`,
    // Questions carry coverage rather than a score: one the ontology already
    // answers is the safe case, anything partial needs the gate's detail.
    score: null,
    scoreLabel: question.coverage,
    coverage: question.coverage,
    decidable: question.coverage === COVERAGE.covered,
  })),
];

/** The queue groups by gate, because that is the thing you would open next. */
export const QUEUE_GROUPS = [
  {
    id: 'concepts',
    runId: PROPOSAL_RUN,
    label: 'Concepts',
    route: 'reviewConcepts',
    items: QUEUE_ITEMS.filter((item) => item.gate === 'concepts'),
  },
  {
    id: 'relationships',
    runId: PROPOSAL_RUN,
    label: 'Relationships',
    route: 'reviewRelations',
    items: QUEUE_ITEMS.filter((item) => item.gate === 'relationships'),
  },
  {
    id: 'questions',
    runId: QUESTION_RUN,
    label: 'Competency questions',
    route: 'reviewQuestions',
    items: QUEUE_ITEMS.filter((item) => item.gate === 'questions'),
  },
];
