import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import { IMPORT_COPY } from '@/features/sources/constants';
import styles from './ImportAssetsDialog.module.css';

/**
 * Everything picked so far, wherever it came from.
 *
 * A tab shows one workspace at a time, so without this the assets chosen two
 * tabs ago are invisible at exactly the moment the decision is made. Grouping
 * by workspace also answers the question the tabs raise — "have I got what I
 * need from the others?" — without leaving the workspace being read.
 */
export default function SelectionRail({ groups, count, onRemove, onClear }) {
  return (
    <aside className={styles.rail} aria-label="Selected assets">
      <header className={styles.railHead}>
        <span className={styles.railTitle}>{IMPORT_COPY.selected}</span>
        <span className={styles.railCount}>{count}</span>
        {count > 0 && (
          <button type="button" className={styles.railClear} onClick={onClear}>
            {IMPORT_COPY.clear}
          </button>
        )}
      </header>

      {count === 0 ? (
        <p className={styles.railEmpty}>{IMPORT_COPY.railEmpty}</p>
      ) : (
        <div className={styles.railGroups}>
          {groups.map((group) => (
            <section key={group.workspace.id}>
              <div className={styles.railGroupName}>
                <span className={styles.railGroupText}>{group.workspace.name}</span>
                <span className={styles.railGroupCount}>{group.assets.length}</span>
              </div>
              <ul className={styles.railList}>
                {group.assets.map((asset) => (
                  <li key={asset.id} className={styles.railItem}>
                    <span className={styles.railItemName}>{asset.name}</span>
                    <button
                      type="button"
                      className={styles.railRemove}
                      onClick={() => onRemove(asset.id)}
                      aria-label={`Remove ${asset.name} from the import`}
                    >
                      <Icon name="close" size={11} strokeWidth={1.8} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </aside>
  );
}

SelectionRail.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      workspace: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      assets: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired }),
      ).isRequired,
    }),
  ).isRequired,
  count: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};
