/** Public surface of the workspaces feature. Pages are router-only; see sources/index.js. */
export { default as WorkspaceProvider } from './WorkspaceProvider';
export { useWorkspace } from './useWorkspace';
export * from './constants';
export { WORKSPACES, WORKSPACE_STATS, WORKSPACE_COUNTERS } from './mocks';
