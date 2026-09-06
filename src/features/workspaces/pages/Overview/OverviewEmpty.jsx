import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import { EmptyState, Panel } from '@/components/ui/Surfaces';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';

/** A workspace with no sources: the only useful thing to show is the way in. */
export default function OverviewEmpty({ onConnectSources }) {
  return (
    <PageBody>
      <PageHeader
        title="Overview"
        subtitle="Connect the tables and documents this workspace should model. Nothing is extracted until you start a run."
      />
      <Panel center>
        <EmptyState
          icon="database"
          title="No sources connected yet"
          hint="A workspace models the data you point it at. Connect a catalog or upload documents to begin."
          action={
            <Button variant="primary" iconRight="arrowRight" onClick={onConnectSources}>
              Connect sources
            </Button>
          }
        />
      </Panel>
    </PageBody>
  );
}

OverviewEmpty.propTypes = { onConnectSources: PropTypes.func.isRequired };
