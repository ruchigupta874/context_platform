import { TONE } from '@/config/constants/common';

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
  sectionTitle: 'Available workspaces',
  subtitle:
    'A workspace owns its data sources, the ontology extracted from them, and the knowledge graph built on top. Open one to run an extraction.',
  newCardTitle: 'New workspace',
  newCardHint: 'Connect a catalog or upload documents',
};

/* ---- new workspace ---- */

export const WORKSPACE_DIALOG_STEP = {
  details: 'details',
  import: 'import',
};

/** Order matters: the stepper and the Back/Next wiring both read this. */
export const WORKSPACE_DIALOG_STEPS = [
  {
    id: WORKSPACE_DIALOG_STEP.details,
    label: 'Workspace details',
    caption: 'Name and context',
    blurb: 'Tell the extractor what this workspace covers.',
  },
  {
    id: WORKSPACE_DIALOG_STEP.import,
    label: 'Import from UMC',
    caption: 'Optional',
    blurb:
      'Pick the catalogued workspaces this one should build on. Skip it and the workspace starts empty.',
  },
];

/** Widths are grid tracks — the checkbox column is fixed, the text columns share the rest. */
export const UMC_COLUMNS = [
  { id: 'select', label: '', width: '34px' },
  { id: 'name', label: 'Workspace', width: 'minmax(0, 1fr)' },
  { id: 'description', label: 'Description', width: 'minmax(0, 2fr)' },
];

export const WORKSPACE_DIALOG_COPY = {
  title: 'New workspace',
  editTitle: 'Edit workspace',
  editBlurb: 'Change the details, or revise what this workspace imports from UMC.',
  submit: 'Create workspace',
  submitEdit: 'Save changes',
  goToImport: 'Import from UMC',
  goToImportEdit: 'Edit imports',

  introTitle: 'Two steps — and the second one is optional',
  introBody:
    'Start with the basic details: a name, the business domain, and the context the extractor should read your sources with. Then pick any workspaces already catalogued in UMC to build on.',
  introNote:
    'You can skip the import entirely and create the workspace right away — sources can be added at any time afterwards.',

  groupBasics: 'Workspace basics',
  groupBasicsNote: 'How this workspace is identified across the product.',
  groupContext: 'Extraction context',
  groupContextNote: 'Optional, but this is what steers how concepts get named.',

  namePlaceholder: 'Claims-Core',
  nameHint: 'Used in the URL and on every screen. You can change it later.',
  nameRequired: 'Give the workspace a name.',
  descriptionPlaceholder: 'What this workspace covers and who relies on it.',
  domainPlaceholder: 'Healthcare Policy',
  domainHint: 'The business area this model belongs to.',
  contextPlaceholder:
    'How the business talks about this domain — the terms of art, the entities that matter, the distinctions people insist on.',
  guidancePlaceholder:
    'Naming conventions, entities to avoid, or terms your business insists on. This steers concept naming more than anything else here.',
  searchPlaceholder: 'Search UMC workspaces',
  emptySearch: 'No UMC workspaces match that search.',
};
