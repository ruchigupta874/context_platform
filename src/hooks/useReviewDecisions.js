import { useContext } from 'react';
import { ReviewContext } from '@/context/reviewContext';

export function useReviewDecisions() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviewDecisions must be used inside a ReviewProvider');
  }
  return context;
}
