import { createContext } from 'react';

/** Holds `{ workspaceId, workspace, counters }`. Null until a provider mounts. */
export const WorkspaceContext = createContext(null);
