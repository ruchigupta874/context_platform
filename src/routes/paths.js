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

  runs: '/w/:workspaceId/runs',
  newRun: '/w/:workspaceId/runs/new',
  runDetail: '/w/:workspaceId/runs/:runId',
  reviewQueue: '/w/:workspaceId/review',
  reviewConcepts: '/w/:workspaceId/runs/:runId/review/concepts',
  reviewRelations: '/w/:workspaceId/runs/:runId/review/relationships',
  reviewQuestions: '/w/:workspaceId/runs/:runId/review/questions',
  runOntology: '/w/:workspaceId/runs/:runId/ontology',
  runGraph: '/w/:workspaceId/runs/:runId/graph',

  graph: '/w/:workspaceId/graph',
};

export const buildPath = {
  workspaces: () => PATHS.workspaces,
  overview: (workspaceId) => `/w/${workspaceId}/overview`,
  sources: (workspaceId) => `/w/${workspaceId}/sources`,
  runs: (workspaceId) => `/w/${workspaceId}/runs`,
  newRun: (workspaceId) => `/w/${workspaceId}/runs/new`,
  runDetail: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}`,
  reviewQueue: (workspaceId) => `/w/${workspaceId}/review`,
  reviewConcepts: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}/review/concepts`,
  reviewRelations: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}/review/relationships`,
  reviewQuestions: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}/review/questions`,
  runOntology: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}/ontology`,
  runGraph: (workspaceId, runId) => `/w/${workspaceId}/runs/${runId}/graph`,
  graph: (workspaceId) => `/w/${workspaceId}/graph`,
};

export const DEFAULT_WORKSPACE_ID = 'cms';
