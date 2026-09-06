import { buildPath } from '@/routes/paths';

/**
 * Sidebar model. Grouped exactly as the design: the sidebar answers
 * "what is in this workspace", "what is running", "what came out".
 *
 * `badge` names a counter the Sidebar resolves at render time, so the nav
 * config stays static data and the counts stay live.
 */
export const NAV_GROUPS = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: 'grid', to: buildPath.overview },
      { id: 'sources', label: 'Data sources', icon: 'database', to: buildPath.sources },
    ],
  },
  {
    id: 'extraction',
    label: 'Extraction',
    items: [
      {
        id: 'runs',
        label: 'Runs',
        icon: 'play',
        to: buildPath.runs,
        badge: 'activeRuns',
        badgeTone: 'info',
      },
      {
        id: 'review',
        label: 'Review queue',
        icon: 'inbox',
        to: buildPath.reviewQueue,
        badge: 'pendingReviews',
        badgeTone: 'warn',
      },
    ],
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    items: [{ id: 'graph', label: 'Knowledge graph', icon: 'graph', to: buildPath.graph }],
  },
];
