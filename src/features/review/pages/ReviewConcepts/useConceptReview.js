import { createGateReview } from '@/features/review/gateReview';
import { CONCEPT_REVIEW } from '@/features/review/conceptMocks';
import { normalizeConcept } from '@/features/review/conceptReview';

/** The concept gate's rows. See `createGateReview` for what stands in for the fetch. */
export const useConceptReview = createGateReview(CONCEPT_REVIEW, normalizeConcept);
