import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import SearchInput from '@/components/ui/SearchInput';
import { DataTable, DataTableBody, DataTableHead, DataTableRow } from '@/components/ui/DataTable';
import { WORKSPACE_DIALOG_COPY, UMC_COLUMNS } from '@/features/workspaces/constants';
import { pluralize } from '@/utils/format';
import styles from './WorkspaceDialog.module.css';

/**
 * Step 2. A table rather than cards: the list is long, each row carries two
 * fields, and the job is bulk selection — so a single checkbox column you can
 * run your eye down beats a grid you have to hunt across.
 *
 * Rows are not buttons. The checkbox is the one keyboard and screen-reader
 * control per row; the overlay behind it is a pointer convenience only, which
 * is why it is aria-hidden and out of the tab order.
 */
export default function ImportStep({
  query,
  setQuery,
  visible,
  selection,
  allVisibleSelected,
  toggleAllVisible,
  totalCount,
}) {
  return (
    <>
      <div className={styles.tableControls}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={WORKSPACE_DIALOG_COPY.searchPlaceholder}
          width={260}
        />
        <span className={styles.resultCount}>
          Showing {visible.length} of {pluralize(totalCount, 'workspace')}
        </span>
        <div className={styles.spacer} />
        {selection.count > 0 && (
          <>
            <span className={styles.selectedCount}>{selection.count} selected</span>
            <Button variant="ghost" size="sm" onClick={selection.clear}>
              Clear
            </Button>
          </>
        )}
      </div>

      {visible.length === 0 ? (
        <div className={styles.empty}>{WORKSPACE_DIALOG_COPY.emptySearch}</div>
      ) : (
        <DataTable className={styles.table}>
          <DataTableHead
            columns={UMC_COLUMNS}
            compact
            leading={
              <Checkbox
                size="sm"
                checked={allVisibleSelected}
                onChange={toggleAllVisible}
                label="Select every workspace matching the current search"
              />
            }
          />
          <DataTableBody>
            {visible.map((workspace) => {
              const checked = selection.isSelected(workspace.id);
              return (
                <DataTableRow
                  key={workspace.id}
                  columns={UMC_COLUMNS}
                  selected={checked}
                  height="var(--row-h-compact)"
                  className={styles.row}
                >
                  <Checkbox
                    size="sm"
                    checked={checked}
                    onChange={() => selection.toggle(workspace.id)}
                    label={`Import ${workspace.name}`}
                  />
                  <span className={styles.rowName}>{workspace.name}</span>
                  <span className={styles.rowDesc}>{workspace.description}</span>
                  <button
                    type="button"
                    aria-hidden="true"
                    tabIndex={-1}
                    className={styles.rowHit}
                    onClick={() => selection.toggle(workspace.id)}
                  />
                </DataTableRow>
              );
            })}
          </DataTableBody>
        </DataTable>
      )}
    </>
  );
}

ImportStep.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  visible: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selection: PropTypes.shape({
    count: PropTypes.number.isRequired,
    isSelected: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
  }).isRequired,
  allVisibleSelected: PropTypes.bool.isRequired,
  toggleAllVisible: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
};
