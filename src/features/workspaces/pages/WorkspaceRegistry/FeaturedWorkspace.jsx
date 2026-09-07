import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { StatGrid } from '@/components/ui/Surfaces';
import { TONE } from '@/config/constants/common';
import { pluralize } from '@/utils/format';
import styles from './WorkspaceRegistry.module.css';

/**
 * The selected workspace, read large, with the brand rail across its top edge —
 * the one panel on this screen that is not one of a set.
 *
 * The KPI row is still fixture data; only the identity above it follows the
 * selection, which is why the numbers are passed in rather than derived here.
 */
export default function FeaturedWorkspace({ workspace, stats, onOpen }) {
  return (
    <section className={styles.featured}>
      <div className={styles.featuredTop}>
        <div className={styles.featuredBody}>
          <Chip tone={TONE.warn}>{pluralize(workspace.activeRuns, 'run')} active</Chip>
          <h2 className={styles.featuredName}>{workspace.name}</h2>
          <p className={styles.featuredDomain}>{workspace.businessDomain}</p>
        </div>
        <Button variant="primary" iconRight="arrowRight" onClick={onOpen}>
          Open
        </Button>
      </div>
      <StatGrid stats={stats} columns={6} />
    </section>
  );
}

FeaturedWorkspace.propTypes = {
  workspace: PropTypes.shape({
    name: PropTypes.string.isRequired,
    businessDomain: PropTypes.string.isRequired,
    activeRuns: PropTypes.number.isRequired,
  }).isRequired,
  stats: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  onOpen: PropTypes.func.isRequired,
};
