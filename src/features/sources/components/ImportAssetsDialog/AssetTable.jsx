import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import Chip from '@/components/ui/Chip';
import Checkbox from '@/components/ui/Checkbox';
import { DataTable, DataTableBody, DataTableHead, DataTableRow } from '@/components/ui/DataTable';
import { ASSET_COLUMNS, IMPORT_COPY } from '@/features/sources/constants';
import { TONE } from '@/config/constants/common';
import styles from './ImportAssetsDialog.module.css';

/**
 * The open workspace's assets, already filtered.
 *
 * Selection is shared across every workspace, so the object is passed down
 * rather than a callback per action: this table only ever asks it questions
 * about the rows it is currently showing. "Select all" therefore means "select
 * everything shown", which is what people expect once a filter is on.
 *
 * An asset this workspace already holds stays listed but out of the running —
 * hiding it would leave you hunting for something that is already here.
 */
export default function AssetTable({ assets, importedIds, selection }) {
  const selectableIds = assets
    .filter((asset) => !importedIds.includes(asset.id))
    .map((asset) => asset.id);

  return (
    <DataTable className={styles.table}>
      <DataTableHead
        columns={ASSET_COLUMNS}
        compact
        leading={
          <Checkbox
            size="sm"
            checked={selection.allSelected(selectableIds)}
            disabled={selectableIds.length === 0}
            onChange={(next) => selection.toggleMany(selectableIds, next)}
            label="Select every asset shown"
          />
        }
      />
      <DataTableBody>
        {assets.length === 0 ? (
          <p className={styles.noMatch}>{IMPORT_COPY.noMatch}</p>
        ) : (
          assets.map((asset) => {
            const imported = importedIds.includes(asset.id);
            return (
              <DataTableRow
                key={asset.id}
                columns={ASSET_COLUMNS}
                height="38px"
                className={imported ? styles.rowImported : ''}
              >
                <div>
                  <Checkbox
                    size="sm"
                    checked={!imported && selection.isSelected(asset.id)}
                    disabled={imported}
                    onChange={() => selection.toggle(asset.id)}
                    label={`Select ${asset.name}`}
                  />
                </div>
                <div className={styles.assetName}>
                  <Icon name="doc" size={14} className={styles.assetIcon} />
                  <span className={styles.assetText}>{asset.name}</span>
                </div>
                <div className={styles.mono}>{asset.kind}</div>
                <div className={styles.mono}>{asset.pages}</div>
                <div className={styles.mono}>{asset.updated}</div>
                <div className={styles.stateCell}>
                  {imported && <Chip tone={TONE.neutral}>{IMPORT_COPY.imported}</Chip>}
                </div>
              </DataTableRow>
            );
          })
        )}
      </DataTableBody>
    </DataTable>
  );
}

AssetTable.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string.isRequired,
      pages: PropTypes.number.isRequired,
      updated: PropTypes.string.isRequired,
    }),
  ).isRequired,
  importedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  selection: PropTypes.shape({
    isSelected: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    toggleMany: PropTypes.func.isRequired,
    allSelected: PropTypes.func.isRequired,
  }).isRequired,
};
