import { CONFIDENCE_BANDS } from '../../config/constants/common';
import { COVERAGE } from '../../config/constants/questions';
import { CONCEPTS, PROPOSAL_RUN, RELATIONS } from '../../mocks/review';
import { QUESTION_RUN, QUESTIONS } from '../../mocks/questions';
import { relationLabel } from '../../utils/format';

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
  ...CONCEPTS.map((concept) => ({
    id: concept.id,
    runId: PROPOSAL_RUN,
    gate: 'concepts',
    kind: 'concept',
    name: concept.name,
    sub: concept.source,
    score: concept.confidence,
    scoreLabel: concept.confidence.toFixed(2),
    decidable: concept.confidence >= HIGH_CONFIDENCE,
  })),
  ...RELATIONS.map((relation) => ({
    id: relation.id,
    runId: PROPOSAL_RUN,
    gate: 'concepts',
    kind: 'relation',
    name: relationLabel(relation),
    sub: `${relation.kind} · ${relation.cardinality}`,
    score: relation.confidence,
    scoreLabel: relation.confidence.toFixed(2),
    decidable: relation.confidence >= HIGH_CONFIDENCE,
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
    label: 'Concepts & relationships',
    route: 'reviewConcepts',
    items: QUEUE_ITEMS.filter((item) => item.gate === 'concepts'),
  },
  {
    id: 'questions',
    runId: QUESTION_RUN,
    label: 'Competency questions',
    route: 'reviewQuestions',
    items: QUEUE_ITEMS.filter((item) => item.gate === 'questions'),
  },
];
