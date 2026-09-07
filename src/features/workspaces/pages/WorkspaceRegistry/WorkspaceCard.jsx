import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import Chip from '@/components/ui/Chip';
import { WORKSPACE_STATUS, WORKSPACE_STATUS_TONES } from '@/features/workspaces/constants';
import styles from './WorkspaceRegistry.module.css';

/** Cards arrive one after another, so the grid assembles instead of blinking in. */
const STAGGER_MS = 70;

/** Cards follow the panel above them in, rather than racing it. */
const BASE_DELAY_MS = 160;

/**
 * One workspace in the grid. Two separate jobs, so two separate controls: the
 * body selects the workspace (which is what the panel above reads), and the
 * footer link opens it. Neither is a div pretending to be a button.
 */
export default function WorkspaceCard({ workspace, index, isSelected, onSelect, onOpen }) {
  return (
    <article
      className={[styles.card, isSelected ? styles.cardSelected : ''].filter(Boolean).join(' ')}
      style={{ animationDelay: `${BASE_DELAY_MS + index * STAGGER_MS}ms` }}
    >
      <button
        type="button"
        className={styles.cardSelect}
        aria-pressed={isSelected}
        onClick={onSelect}
      >
        <span className={styles.cardTop}>
          <span className={styles.cardIcon}>
            <Icon name="database" size={14} />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardName}>{workspace.name}</span>
            <span className={styles.cardDomain}>{workspace.businessDomain}</span>
          </span>
          <Chip tone={WORKSPACE_STATUS_TONES[workspace.status]}>{workspace.status}</Chip>
        </span>
        <span className={styles.cardBlurb}>{workspace.blurb}</span>
      </button>

      <div className={styles.cardFoot}>
        <span className={styles.cardFootStrong}>{workspace.concepts}</span> concepts
        <span className={styles.cardFootDot}>·</span>
        <span className={styles.cardFootStrong}>{workspace.relations}</span> relations
        <span className={styles.cardFootSpacer} />
        <button type="button" className={styles.cardOpen} onClick={onOpen}>
          Open
          <Icon name="arrowRight" size={12} />
        </button>
      </div>
    </article>
  );
}

WorkspaceCard.propTypes = {
  workspace: PropTypes.shape({
    name: PropTypes.string.isRequired,
    businessDomain: PropTypes.string.isRequired,
    status: PropTypes.oneOf(Object.values(WORKSPACE_STATUS)).isRequired,
    blurb: PropTypes.string.isRequired,
    concepts: PropTypes.number.isRequired,
    relations: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};
