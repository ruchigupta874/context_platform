import { WORKSPACE_STATUS } from '@/config/constants/workspaces';

export const WORKSPACES = [
  {
    id: 'cms',
    name: 'CMS-MEDICATED_MC',
    slug: 'cms',
    businessDomain: 'Healthcare Policy',
    status: WORKSPACE_STATUS.draft,
    version: 'v1',
    // iri: "https://ctx.internal/ontology/cms#",
    blurb:
      'Content management model: clinical documents, care guidelines and the metadata that governs how they are published.',
    concepts: 47,
    relations: 62,
    activeRuns: 1,
  },
  {
    id: 'emr',
    name: 'Pharmaceuticals Ontology',
    slug: 'emr',
    businessDomain: 'Pharmaceuticals',
    status: WORKSPACE_STATUS.draft,
    version: 'v1',
    // iri: "https://ctx.internal/ontology/emr#",
    blurb:
      'Electronic medical records: patients, encounters, diagnoses, medications and the observations recorded against them.',
    concepts: 38,
    relations: 51,
    activeRuns: 1,
  },
];

/**
 * KPI values shown above the grid. Static for now — only the workspace identity
 * around them follows the selected card.
 */
export const WORKSPACE_STATS = [
  { id: 'sources', label: 'Sources', value: '10' },
  { id: 'concepts', label: 'Concepts', value: '47' },
  { id: 'relations', label: 'Relationships', value: '62' },
  { id: 'questions', label: 'Questions', value: '24' },
  { id: 'nodes', label: 'Graph nodes', value: '12.4k' },
  { id: 'coverage', label: 'Coverage', value: '94%', tone: 'ok' },
];

/** Counters the sidebar badges read. */
export const WORKSPACE_COUNTERS = {
  activeRuns: 1,
  pendingReviews: 2,
};
