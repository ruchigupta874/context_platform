import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import { EmptyState, Panel } from '@/components/ui/Surfaces';
import { useWorkspace } from '@/hooks/useWorkspace';

/**
 * Stands in for nav destinations that are routed but not designed yet.
 * Better than a dead link: the route exists, so the sidebar tells the truth.
 */
export default function Placeholder({ title, icon = 'grid', hint }) {
  const { workspace } = useWorkspace();

  return (
    <>
      <TopBar crumbs={[{ label: workspace.name }, { label: title }]} />
      <PageBody>
        <Panel center>
          <EmptyState
            icon={icon}
            title={`${title} is not built yet`}
            hint={
              hint ??
              'The route exists so navigation works end to end. Drop the real screen in here.'
            }
          />
        </Panel>
      </PageBody>
    </>
  );
}
