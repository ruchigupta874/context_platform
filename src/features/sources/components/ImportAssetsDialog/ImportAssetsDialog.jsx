import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { Modal, ModalBody, ModalClose, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/Surfaces';
import { IMPORT_COPY } from '@/features/sources/constants';
import { assetsFor } from '@/features/sources/assets';
import { WORKSPACES } from '@/features/workspaces';
import { useSelection } from '@/hooks/useSelection';
import { pluralize } from '@/utils/format';
import AssetTable from './AssetTable';
import SelectionRail from './SelectionRail';
import styles from './ImportAssetsDialog.module.css';

/**
 * Every workspace that actually has a library. Workspaces are fixtures today,
 * so this resolves once at module load; when they arrive over the wire it
 * becomes the dialog's own fetch.
 */
const ASSET_GROUPS = WORKSPACES.map((workspace) => ({
  workspace,
  assets: assetsFor(workspace.id),
})).filter((group) => group.assets.length > 0);

const ASSET_BY_ID = new Map(
  ASSET_GROUPS.flatMap((group) => group.assets.map((asset) => [asset.id, asset])),
);

const TABS = ASSET_GROUPS.map((group) => ({
  id: group.workspace.id,
  label: group.workspace.name,
  icon: 'database',
  count: group.assets.length,
}));

/**
 * Pick assets from any workspace and bring them in as documents.
 *
 * One workspace at a time, because a library can run to hundreds of files and
 * stacking them all on one page makes every one of them harder to find. What
 * that costs — losing sight of picks made on another tab — the rail pays back:
 * selection is a single set across every workspace, and the rail is that set.
 */
export default function ImportAssetsDialog({ importedIds, onOpenChange, onImport }) {
  const selection = useSelection();
  const [workspaceId, setWorkspaceId] = useState(ASSET_GROUPS[0]?.workspace.id);
  const [query, setQuery] = useState('');

  const active = ASSET_GROUPS.find((group) => group.workspace.id === workspaceId);
  const selectedSet = selection.selected;

  // The tab is the scope of the filter; the rail is what keeps everything
  // outside that scope in view while it is narrowed.
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const assets = active?.assets ?? [];
    return needle ? assets.filter((asset) => asset.name.toLowerCase().includes(needle)) : assets;
  }, [active, query]);

  const chosen = useMemo(
    () =>
      ASSET_GROUPS.map((group) => ({
        workspace: group.workspace,
        assets: group.assets.filter((asset) => selectedSet.has(asset.id)),
      })).filter((group) => group.assets.length > 0),
    [selectedSet],
  );

  // Switching workspace clears the filter: a needle typed for one library
  // almost never means anything in the next, and a tab that opens pre-filtered
  // reads as a tab with three assets in it.
  const openWorkspace = (id) => {
    setWorkspaceId(id);
    setQuery('');
  };

  const confirm = () => {
    onImport(selection.selectedIds.map((id) => ASSET_BY_ID.get(id)).filter(Boolean));
    onOpenChange(false);
  };

  return (
    <Modal open onOpenChange={onOpenChange}>
      <ModalContent title={IMPORT_COPY.title} description={IMPORT_COPY.blurb} size="xl">
        {ASSET_GROUPS.length === 0 ? (
          <ModalBody>
            <EmptyState icon="doc" title={IMPORT_COPY.empty} />
          </ModalBody>
        ) : (
          <ModalBody flush className={styles.dialogBody}>
            <div className={styles.toolbar}>
              <SegmentedControl
                options={TABS}
                value={workspaceId}
                onChange={openWorkspace}
                ariaLabel="Workspace"
              />
              <div className={styles.spacer} />
              {query && (
                <span className={styles.shown}>
                  {visible.length} of {active.assets.length}
                </span>
              )}
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder={IMPORT_COPY.search}
                width={200}
                aria-label={`${IMPORT_COPY.search} in ${active.workspace.name}`}
              />
            </div>

            <div className={styles.split}>
              <div className={styles.tableArea}>
                <AssetTable assets={visible} importedIds={importedIds} selection={selection} />
              </div>
              <SelectionRail
                groups={chosen}
                count={selection.count}
                onRemove={selection.toggle}
                onClear={selection.clear}
              />
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <div className={styles.spacer} />
          <ModalClose>
            <Button variant="secondary">{IMPORT_COPY.cancel}</Button>
          </ModalClose>
          <Button variant="primary" disabled={selection.count === 0} onClick={confirm}>
            {selection.count > 0
              ? `${IMPORT_COPY.done} ${pluralize(selection.count, 'asset')}`
              : IMPORT_COPY.done}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ImportAssetsDialog.propTypes = {
  /** Documents this workspace already holds, so their assets read as imported. */
  importedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
};
