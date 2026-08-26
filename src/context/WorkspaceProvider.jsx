import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { WorkspaceContext } from './workspaceContext';
import { WORKSPACES, WORKSPACE_COUNTERS } from '../mocks/workspaces';
import { DEFAULT_WORKSPACE_ID } from '../routes/paths';

/**
 * Resolves the active workspace once from the route and shares it downwards,
 * so pages, the sidebar and every link stop threading `workspaceId` by hand.
 */
export default function WorkspaceProvider({ children }) {
  const { workspaceId = DEFAULT_WORKSPACE_ID } = useParams();

  const value = useMemo(() => {
    const workspace = WORKSPACES.find((item) => item.id === workspaceId) ?? WORKSPACES[0];
    return { workspaceId: workspace.id, workspace, counters: WORKSPACE_COUNTERS };
  }, [workspaceId]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
