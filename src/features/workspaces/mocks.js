import { WORKSPACE_STATUS } from '@/features/workspaces/constants';

export const WORKSPACES = [
  {
    id: 'cms',
    name: 'CMS-MEDICATED_MC',
    slug: 'cms',
    businessDomain: 'Healthcare Policy',
    status: WORKSPACE_STATUS.draft,
    version: 'v1',
    // iri: "https://ctx.internal/ontology/cms#",
    blurb:
      'Content management model: clinical documents, care guidelines and the metadata that governs how they are published.',
    concepts: 47,
    relations: 62,
    activeRuns: 1,
  },
  {
    id: 'emr',
    name: 'Pharmaceuticals Ontology',
    slug: 'emr',
    businessDomain: 'Pharmaceuticals',
    status: WORKSPACE_STATUS.draft,
    version: 'v1',
    // iri: "https://ctx.internal/ontology/emr#",
    blurb:
      'Electronic medical records: patients, encounters, diagnoses, medications and the observations recorded against them.',
    concepts: 38,
    relations: 51,
    activeRuns: 1,
  },
];

/**
 * KPI values shown above the grid. Static for now — only the workspace identity
 * around them follows the selected card.
 */
export const WORKSPACE_STATS = [
  { id: 'sources', label: 'Sources', value: '10' },
  { id: 'concepts', label: 'Concepts', value: '47' },
  { id: 'relations', label: 'Relationships', value: '62' },
  { id: 'questions', label: 'Questions', value: '24' },
  { id: 'nodes', label: 'Graph nodes', value: '12.4k' },
  { id: 'coverage', label: 'Coverage', value: '94%', tone: 'ok' },
];

/** Counters the sidebar badges read. */
export const WORKSPACE_COUNTERS = {
  activeRuns: 1,
  pendingReviews: 2,
};

/**
 * Workspaces already catalogued in UMC.
 *
 * Deliberately longer than a screen: the import step exists to be searched and
 * bulk-selected, and a five-row fixture would hide every problem with it.
 */
export const UMC_WORKSPACES = [
  {
    id: 'umc-claims-core',
    name: 'Claims-Core',
    description: 'Adjudication rules, claim lines and the payment decisions taken against them.',
  },
  {
    id: 'umc-provider-registry',
    name: 'Provider-Registry',
    description: 'NPI records, credentials, specialties and practice locations.',
  },
  {
    id: 'umc-member-360',
    name: 'Member-360',
    description: 'Enrolment, plan history and the household relationships behind a member.',
  },
  {
    id: 'umc-rx-formulary',
    name: 'Rx-Formulary',
    description: 'Drug tiers, prior-authorisation rules and formulary exceptions by plan.',
  },
  {
    id: 'umc-encounters',
    name: 'Encounter-Records',
    description: 'Visits, admissions and discharges with the diagnoses coded against them.',
  },
  {
    id: 'umc-benefits',
    name: 'Benefit-Design',
    description: 'Plan benefits, cost-sharing tiers and the accumulators that track them.',
  },
  {
    id: 'umc-billing',
    name: 'Billing-Ledger',
    description: 'Invoices, remittances and the reconciliation state of each billing account.',
  },
  {
    id: 'umc-quality',
    name: 'Quality-Measures',
    description: 'HEDIS and STAR measure definitions with their numerator and denominator logic.',
  },
  {
    id: 'umc-auth',
    name: 'Prior-Authorization',
    description: 'Authorisation requests, clinical criteria and review outcomes.',
  },
  {
    id: 'umc-network',
    name: 'Network-Contracts',
    description: 'Provider contracts, fee schedules and the networks each plan draws on.',
  },
  {
    id: 'umc-clinical-notes',
    name: 'Clinical-Notes',
    description: 'Unstructured progress notes, discharge summaries and consult letters.',
  },
  {
    id: 'umc-lab',
    name: 'Lab-Results',
    description: 'LOINC-coded observations, reference ranges and specimen metadata.',
  },
  {
    id: 'umc-appeals',
    name: 'Appeals-Grievances',
    description: 'Member appeals, grievance intake and the resolution trail for each case.',
  },
  {
    id: 'umc-care-mgmt',
    name: 'Care-Management',
    description: 'Care plans, assessments and the interventions assigned to care teams.',
  },
  {
    id: 'umc-risk',
    name: 'Risk-Adjustment',
    description: 'HCC coding, risk scores and the submissions filed for each period.',
  },
  {
    id: 'umc-eligibility',
    name: 'Eligibility-Feed',
    description: 'Daily eligibility spans, terminations and retroactive coverage changes.',
  },
  {
    id: 'umc-pharmacy-claims',
    name: 'Pharmacy-Claims',
    description: 'Dispensed scripts, NDC detail and pharmacy-side rejection reasons.',
  },
  {
    id: 'umc-referrals',
    name: 'Referral-Tracking',
    description: 'Referrals between providers and whether the downstream visit occurred.',
  },
  {
    id: 'umc-policy-docs',
    name: 'Policy-Library',
    description: 'Medical policy documents, coverage criteria and their effective dating.',
  },
  {
    id: 'umc-contact-centre',
    name: 'ContactCentre-Interactions',
    description: 'Calls, chats and case notes captured by member and provider services.',
  },
  {
    id: 'umc-vendor',
    name: 'Vendor-Delegation',
    description: 'Delegated vendors, the functions they own and their reporting obligations.',
  },
  {
    id: 'umc-fraud',
    name: 'FWA-Signals',
    description: 'Fraud, waste and abuse indicators raised against claims and providers.',
  },
];
