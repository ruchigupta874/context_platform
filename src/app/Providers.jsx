import PropTypes from 'prop-types';
import { WorkspaceProvider } from '@/features/workspaces';
import { ReviewProvider } from '@/features/review';

/**
 * Every context the workspace subtree needs, composed in one place.
 *
 * These live here rather than inside AppShell so the shell stays a layout
 * component: adding a provider is an app-wiring change, not a change to the
 * thing that draws the sidebar.
 */
export default function Providers({ children }) {
  return (
    <WorkspaceProvider>
      <ReviewProvider>{children}</ReviewProvider>
    </WorkspaceProvider>
  );
}

Providers.propTypes = { children: PropTypes.node };
