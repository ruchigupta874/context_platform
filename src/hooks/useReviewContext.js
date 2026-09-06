import { useContext } from 'react';
import { ReviewContext } from '@/context/reviewContext';

export function useReviewContext() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviewContext must be used inside a ReviewProvider');
  }
  return context;
}
