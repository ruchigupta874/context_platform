import { WORKSPACE_ASSETS } from '@/features/sources/mocks';

/** What a workspace holds. A workspace with no library reads as an empty one. */
export const assetsFor = (workspaceId) => WORKSPACE_ASSETS[workspaceId] ?? [];

/**
 * An imported asset becomes an ordinary document: same shape, and it lands
 * un-extracted, because copying a file in says nothing about whether this
 * workspace has read it yet. The Status column takes it from there.
 */
export const assetToDocument = (asset) => ({
  id: asset.id,
  name: asset.name,
  kind: asset.kind,
  pages: asset.pages,
  uploaded: asset.updated,
  indexed: true,
  lastRun: null,
  drift: null,
});
