import { WORKSPACE_STATUS } from '../config/constants/workspaces';

export const WORKSPACES = [
  {
    id: 'cust360auto',
    name: 'Cust360Auto',
    slug: 'cust360auto',
    status: WORKSPACE_STATUS.draft,
    version: 'v5',
    blurb: 'Unified customer view across contracts, billing, claims and contact-centre interactions.',
    concepts: 47,
    relations: 62,
  },
  {
    id: 'telcoradio',
    name: 'TelcoRadio',
    slug: 'telcoradio',
    status: WORKSPACE_STATUS.draft,
    version: 'v1',
    blurb: 'Radio access network inventory: cells, sites, sectors and their fault history.',
    concepts: 31,
    relations: 44,
  },
  {
    id: 'energycust360',
    name: 'EnergyCust360',
    slug: 'energycust360',
    status: WORKSPACE_STATUS.inReview,
    version: 'v2',
    blurb: 'Metering, consumption and tariff model for the residential energy business.',
    concepts: 38,
    relations: 51,
  },
  {
    id: 'contactcentre',
    name: 'ContactCentre',
    slug: 'contactcentre',
    status: WORKSPACE_STATUS.published,
    version: 'v7',
    blurb: 'Call, chat and case taxonomy shared by the service desk and quality teams.',
    concepts: 22,
    relations: 29,
  },
  {
    id: 'predictivemaint',
    name: 'PredictiveMaint',
    slug: 'predictivemaint',
    status: WORKSPACE_STATUS.published,
    version: 'v4',
    blurb: 'Asset, sensor and work-order model feeding the maintenance scheduling engine.',
    concepts: 29,
    relations: 37,
  },
];

export const LAST_OPENED_WORKSPACE = {
  ...WORKSPACES[0],
  iri: 'https://ctx.internal/ontology/cust360auto#',
  activeRuns: 2,
  stats: [
    { id: 'sources', label: 'Sources', value: '10' },
    { id: 'concepts', label: 'Concepts', value: '47' },
    { id: 'relations', label: 'Relationships', value: '62' },
    { id: 'questions', label: 'Questions', value: '24' },
    { id: 'nodes', label: 'Graph nodes', value: '12.4k' },
    { id: 'coverage', label: 'Coverage', value: '94%', tone: 'ok' },
  ],
};

/** Counters the sidebar badges read. */
export const WORKSPACE_COUNTERS = {
  activeRuns: 2,
  pendingReviews: 3,
  validationErrors: 1,
};
