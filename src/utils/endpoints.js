/**
 * Every backend URL the app will call, in one place.
 *
 * Nothing here is wired up yet — the app runs on the fixtures in `src/mocks`.
 * When the API lands, the only change needed is flipping USE_MOCKS to false in
 * `utils/api.js`; these paths are what it will hit.
 */

export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';

export const ENDPOINTS = {
  workspaces: {
    list: () => '/workspaces',
    detail: (workspaceId) => `/workspaces/${workspaceId}`,
    create: () => '/workspaces',
  },

  sources: {
    tables: (workspaceId) => `/workspaces/${workspaceId}/sources/tables`,
    documents: (workspaceId) => `/workspaces/${workspaceId}/sources/documents`,
    syncCatalog: (workspaceId) => `/workspaces/${workspaceId}/sources/sync`,
    upload: (workspaceId) => `/workspaces/${workspaceId}/sources/documents`,
    drift: (workspaceId) => `/workspaces/${workspaceId}/sources/drift`,
  },

  runs: {
    list: (workspaceId) => `/workspaces/${workspaceId}/runs`,
    detail: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}`,
    create: (workspaceId) => `/workspaces/${workspaceId}/runs`,
    // Re-extraction: same shape as create, but bound to an existing ontology version.
    update: (workspaceId, version) => `/workspaces/${workspaceId}/runs?mode=update&base=${version}`,
    cancel: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/cancel`,
    hold: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/hold`,
    logs: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/logs`,
  },

  review: {
    concepts: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/concepts`,
    relations: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/relations`,
    decide: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/decisions`,
    advance: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/advance`,
  },

  questions: {
    list: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/questions`,
    decide: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/questions/decisions`,
    create: (workspaceId, runId) => `/workspaces/${workspaceId}/runs/${runId}/questions`,
  },

  ontology: {
    detail: (workspaceId) => `/workspaces/${workspaceId}/ontology`,
    classDetail: (workspaceId, classId) => `/workspaces/${workspaceId}/ontology/classes/${classId}`,
    validation: (workspaceId) => `/workspaces/${workspaceId}/ontology/validation`,
    exportOwl: (workspaceId) => `/workspaces/${workspaceId}/ontology/export/owl`,
    exportR2rml: (workspaceId) => `/workspaces/${workspaceId}/ontology/export/r2rml`,
    publish: (workspaceId) => `/workspaces/${workspaceId}/ontology/publish`,
  },

  graph: {
    neighbourhood: (workspaceId, entityId, depth) =>
      `/workspaces/${workspaceId}/graph/neighbourhood?entity=${entityId}&depth=${depth}`,
    entity: (workspaceId, entityId) => `/workspaces/${workspaceId}/graph/entities/${entityId}`,
    search: (workspaceId, term) => `/workspaces/${workspaceId}/graph/search?q=${encodeURIComponent(term)}`,
    query: (workspaceId) => `/workspaces/${workspaceId}/graph/query`,
  },
};
