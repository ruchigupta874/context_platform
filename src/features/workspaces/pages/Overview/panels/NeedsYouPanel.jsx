import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import { Panel, PanelHeader } from '@/components/ui/Surfaces';
import { pluralize } from '@/utils/format';
import styles from '../Overview.module.css';

const ROW_TONE_CLASS = { danger: styles.rowDanger, warn: styles.rowWarn };

/** Everything blocking this workspace, most urgent first. */
export default function NeedsYouPanel({ items, onOpen }) {
  return (
    <Panel>
      <PanelHeader
        title="Needs you"
        meta={items.length ? pluralize(items.length, 'item') : 'Nothing waiting'}
      />
      {items.length === 0 ? (
        <div className={styles.quiet}>
          <Icon name="check" size={14} />
          Every run is either moving or finished, and this version validates clean.
        </div>
      ) : (
        <ul className={styles.rows}>
          {items.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={[styles.row, ROW_TONE_CLASS[item.tone]].filter(Boolean).join(' ')}
                onClick={() => onOpen(item.to)}
              >
                <span className={styles.rowIcon}>
                  <Icon name={item.icon} size={14} />
                </span>
                <span className={styles.rowTitle}>{item.title}</span>
                <span className={styles.rowDetail}>{item.detail}</span>
                <span className={styles.rowMeta}>{item.meta}</span>
                <Icon name="arrowRight" size={14} className={styles.rowArrow} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

NeedsYouPanel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      tone: PropTypes.oneOf(['danger', 'warn']).isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.node,
      detail: PropTypes.node,
      meta: PropTypes.node,
      to: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onOpen: PropTypes.func.isRequired,
};
