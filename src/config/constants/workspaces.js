import { TONE } from './common';

export const WORKSPACE_STATUS = {
  draft: 'Draft',
  inReview: 'In review',
  published: 'Published',
};

export const WORKSPACE_STATUS_TONES = {
  [WORKSPACE_STATUS.draft]: TONE.neutral,
  [WORKSPACE_STATUS.inReview]: TONE.warn,
  [WORKSPACE_STATUS.published]: TONE.ok,
};

export const WORKSPACE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: WORKSPACE_STATUS.draft, label: WORKSPACE_STATUS.draft },
  { id: WORKSPACE_STATUS.inReview, label: WORKSPACE_STATUS.inReview },
  { id: WORKSPACE_STATUS.published, label: WORKSPACE_STATUS.published },
];

export const REGISTRY_COPY = {
  title: 'Workspaces',
  selectedLabel: 'SELECTED',
  subtitle:
    'A workspace owns its data sources, the ontology extracted from them, and the knowledge graph built on top. Open one to run an extraction.',
  newCardTitle: 'New workspace',
  newCardHint: 'Connect a catalog or upload documents',
};
