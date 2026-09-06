import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { Panel, PanelHeader } from '@/components/ui/Surfaces';
import { SOURCE_KIND } from '@/features/sources';
import { BUILT_BY_RUN } from '@/features/graph';
import styles from '../Overview.module.css';

/** Sources that changed after the current version was built. */
export default function DriftPanel({ drifted, sourceCount, workspace, onReExtract }) {
  return (
    <Panel>
      <PanelHeader title="Drifted since last build" meta={`${drifted.length} of ${sourceCount}`} />
      {drifted.length === 0 ? (
        <div className={styles.quiet}>
          <Icon name="check" size={14} />
          Every source is unchanged since {BUILT_BY_RUN} built {workspace.version}.
        </div>
      ) : (
        <>
          <ul className={styles.rows}>
            {drifted.map((source) => (
              <li key={`${source.kind}-${source.id}`}>
                <div className={styles.driftRow}>
                  <span className={styles.rowIcon}>
                    <Icon name={source.kind === SOURCE_KIND.table ? 'database' : 'doc'} size={14} />
                  </span>
                  <span className={styles.driftName}>{source.name}</span>
                  <Chip tone="warn">{source.drift}</Chip>
                  <span className={styles.rowMeta}>{source.lastRun ?? 'never built'}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.panelFoot}>
            <span className={styles.footNote}>
              {workspace.version} was built before these changed, so the graph does not reflect
              them.
            </span>
            <Button size="sm" iconRight="arrowRight" onClick={onReExtract}>
              Re-extract these
            </Button>
          </div>
        </>
      )}
    </Panel>
  );
}

DriftPanel.propTypes = {
  drifted: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, kind: PropTypes.string.isRequired }),
  ).isRequired,
  sourceCount: PropTypes.number.isRequired,
  workspace: PropTypes.shape({ version: PropTypes.string.isRequired }).isRequired,
  onReExtract: PropTypes.func.isRequired,
};
