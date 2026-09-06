import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import styles from './TopBar.module.css';

/**
 * `crumbs` is `[{ label, to?, mono? }]`. The last one always renders as current.
 * The activity pill is deliberately global: a run started on any screen keeps
 * running, and this is the standing reminder that something is in flight.
 */
export default function TopBar({ crumbs = [], note, actions, showNewRun = false }) {
  const { workspaceId, counters } = useWorkspace();
  const navigate = useNavigate();

  return (
    <header className={styles.bar}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          const className = [
            last ? styles.crumbCurrent : styles.crumbLink,
            crumb.mono ? styles.mono : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <Fragment key={crumb.label}>
              {index > 0 && <Icon name="chevronRight" size={12} />}
              {crumb.to && !last ? (
                <Link to={crumb.to} className={className}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={className}>{crumb.label}</span>
              )}
            </Fragment>
          );
        })}
      </nav>

      <div className={styles.spacer} />

      {note && <span className={styles.note}>{note}</span>}
      {note && <div className={styles.divider} />}

      <Link to={buildPath.runs(workspaceId)} className={styles.activity}>
        <span className={styles.pulse} />
        {pluralize(counters.activeRuns, 'run')} active
      </Link>

      {actions}

      {showNewRun && (
        <Button
          variant="primary"
          iconLeft="plus"
          onClick={() => navigate(buildPath.newRun(workspaceId))}
        >
          New extraction
        </Button>
      )}
    </header>
  );
}

TopBar.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      to: PropTypes.string,
      mono: PropTypes.bool,
    }),
  ),
  note: PropTypes.node,
  actions: PropTypes.node,
  showNewRun: PropTypes.bool,
};
