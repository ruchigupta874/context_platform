import { useDecisionState } from '@/features/review/useDecisionState';
import { INITIAL_CONCEPT_DECISIONS } from '@/features/review/conceptMocks';
import { INITIAL_DECISIONS } from '@/features/review/mocks';
import { INITIAL_QUESTION_DECISIONS } from '@/features/review/questionMocks';
import { ReviewContext } from './reviewContext';

/**
 * Approve / reject decisions for every reviewable item in the workspace.
 *
 * The gates and the review queue are two views of the same pile, so the state
 * has to sit above both. Held per gate, approving twelve concepts in the queue
 * would vanish the moment you opened the gate to finish the rest.
 */
const SEED = {
  ...INITIAL_CONCEPT_DECISIONS,
  ...INITIAL_DECISIONS,
  ...INITIAL_QUESTION_DECISIONS,
};

export default function ReviewProvider({ children }) {
  const decisions = useDecisionState(SEED);

  return <ReviewContext.Provider value={decisions}>{children}</ReviewContext.Provider>;
}
