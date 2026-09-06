import { useDecisions } from '@/hooks/useDecisions';
import { INITIAL_DECISIONS } from '@/mocks/review';
import { INITIAL_QUESTION_DECISIONS } from '@/mocks/questions';
import { ReviewContext } from './reviewContext';

/**
 * Approve / reject decisions for every reviewable item in the workspace.
 *
 * The gates and the review queue are two views of the same pile, so the state
 * has to sit above both. Held per gate, approving twelve concepts in the queue
 * would vanish the moment you opened the gate to finish the rest.
 */
const SEED = { ...INITIAL_DECISIONS, ...INITIAL_QUESTION_DECISIONS };

export default function ReviewProvider({ children }) {
  const decisions = useDecisions(SEED);

  return <ReviewContext.Provider value={decisions}>{children}</ReviewContext.Provider>;
}
