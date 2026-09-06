import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import Chip from '@/components/ui/Chip';
import { Panel, PanelHeader, StatGrid } from '@/components/ui/Surfaces';
import { BUILT_BY_RUN } from '@/features/graph';
import styles from '../Overview.module.css';

/** What the currently published version contains. */
export default function VersionPanel({ workspace, stats, onOpenGraph }) {
  return (
    <Panel>
      <PanelHeader title="Current version" meta={BUILT_BY_RUN} />
      <div className={styles.versionBody}>
        <div className={styles.versionTop}>
          <span className={styles.versionNumber}>{workspace.version}</span>
          <Chip tone="neutral">{workspace.status}</Chip>
        </div>
        <StatGrid stats={stats} columns={2} small soft />
        <button type="button" className={styles.panelLink} onClick={onOpenGraph}>
          Open the graph
          <Icon name="arrowRight" size={13} />
        </button>
      </div>
    </Panel>
  );
}

VersionPanel.propTypes = {
  workspace: PropTypes.shape({
    version: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  stats: PropTypes.array.isRequired,
  onOpenGraph: PropTypes.func.isRequired,
};
