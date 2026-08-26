/**
 * Every route in the app, in one place.
 * Builders are functions so a param change never means grepping for template literals.
 */

export const PATHS = {
  root: '/',
  workspaces: '/workspaces',

  workspace: '/w/:workspaceId',
  overview: '/w/:workspaceId/overview',
  sources: '/w/:workspaceId/sources',
  documents: '/w/:workspaceId/documents',

  runs: '/w/:workspaceId/runs',
  newRun: '/w/:workspaceId/runs/new',
  runDetail: '/w/:workspaceId/runs/:runId',
  reviewQueue: '/w/:workspaceId/review',
  reviewConcepts: '/w/:workspaceId/runs/:runId/review/concepts',
  reviewQuestions: '/w/:workspaceId/runs/:runId/review/questions',

  ontology: '/w/:workspaceId/ontology',
  questions: '/w/:workspaceId/questions',
  graph: '/w/:workspaceId/graph',
  validation: '/w/:workspaceId/validation',
};

export const buildPath = {
  workspaces: () => PATHS.workspaces,
  overview: (workspaceId) => `/w/${workspaceId}/overview`,
  sources: (workspaceId) => `/w/${workspaceId}/sources`,
  documents: (workspaceId) => `/w/${workspaceId}/documents`,
  runs: (workspaceId) => `/w/${workspaceId}/runs`,
  newRun: (workspaceId) => `/w/${workspaceId}/runs/new`,
  runDetail: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}`,
  reviewQueue: (workspaceId) => `/w/${workspaceId}/review`,
  reviewConcepts: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}/review/concepts`,
  reviewQuestions: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}/review/questions`,
  ontology: (workspaceId) => `/w/${workspaceId}/ontology`,
  questions: (workspaceId) => `/w/${workspaceId}/questions`,
  graph: (workspaceId) => `/w/${workspaceId}/graph`,
  validation: (workspaceId) => `/w/${workspaceId}/validation`,
};

export const DEFAULT_WORKSPACE_ID = 'cust360auto';
