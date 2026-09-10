import { createGateReview } from '@/features/review/gateReview';
import { RELATIONSHIP_REVIEW } from '@/features/review/relationshipMocks';
import { normalizeRelationship } from '@/features/review/relationshipReview';

/** The relationship gate's rows. See `createGateReview` for what stands in for the fetch. */
export const useRelationReview = createGateReview(RELATIONSHIP_REVIEW, normalizeRelationship);
