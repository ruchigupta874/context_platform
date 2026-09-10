import {
  REVIEW_ITEM_TYPE,
  REVIEW_STATUS,
  seedDecisions,
  toEnvelope,
} from '@/features/review/gateItems';

/**
 * The concept gate of run R-2418, in the shape the review endpoint returns.
 *
 * The seed table below carries only what differs between concepts; `toItem`
 * builds the rest into the envelope the API sends — `aliases` as a JSON string,
 * `confidence` duplicated as a string inside the payload, ids as UUIDs. Keeping
 * the fixture in the wire shape rather than the screen's shape is the point:
 * the normaliser in `conceptReview.js` is exercised on every render, so
 * swapping this module for a fetch changes nothing above it.
 */

/** The run these proposals came out of, and the reviewer who worked the first few. */
const EXECUTION_RUN_ID = '01fa1a34-552f-4dbd-90ff-f325d5caf018';
const REVIEWER_ID = 'd4e6b0c1-77a8-4f31-9c2e-1b5a83ff40de';
const FIRST_CREATED_AT = '2026-09-08T14:41:40.250Z';

const SEED = [
  {
    id: '3a9994ae-8e10-435a-b019-b95c21c51b45',
    name: 'CoveredBenefit',
    type: 'Benefit',
    role: 'Class',
    confidence: 0.9,
    aliases: [
      'CoveredBenefits',
      'CoveredOutpatientDrug',
      'CoveredOutpatientDrugs',
      'CoveredService',
    ],
    definition: 'The benefits provided by a managed care organization.',
  },
  {
    name: 'ManagedCareOrganization',
    type: 'Organization',
    role: 'Class',
    confidence: 0.97,
    status: REVIEW_STATUS.approved,
    comment: 'Matches the definition already published in ContactCentre v7.',
    aliases: ['MCO', 'ManagedCareEntity', 'ManagedCarePlan', 'HealthPlan'],
    definition:
      'An entity under contract with the state to deliver a defined benefit package to enrolled members for a fixed monthly payment.',
  },
  {
    name: 'Enrollee',
    type: 'Person',
    role: 'Class',
    confidence: 0.95,
    status: REVIEW_STATUS.approved,
    aliases: ['Member', 'Beneficiary', 'Recipient', 'CoveredIndividual'],
    definition:
      'An individual determined eligible for Medicaid and enrolled with a managed care organization for their coverage.',
  },
  {
    name: 'StateMedicaidAgency',
    type: 'Organization',
    role: 'Class',
    confidence: 0.93,
    aliases: ['SingleStateAgency', 'StateAgency'],
    definition:
      'The agency in a state that administers the Medicaid programme and holds the contracts with managed care organizations.',
  },
  {
    name: 'CapitationPayment',
    type: 'Payment',
    role: 'Class',
    confidence: 0.91,
    aliases: ['CapitationRate', 'PerMemberPerMonthPayment', 'PMPM'],
    definition:
      'A fixed monthly amount paid to a plan for each enrolled member, regardless of the services that member uses.',
  },
  {
    name: 'NetworkProvider',
    type: 'Provider',
    role: 'Class',
    confidence: 0.94,
    aliases: ['ParticipatingProvider', 'InNetworkProvider', 'ContractedProvider'],
    definition:
      'A provider under contract with a managed care organization to furnish covered services to its members.',
  },
  {
    name: 'PrimaryCareProvider',
    type: 'Provider',
    role: 'Class',
    confidence: 0.92,
    aliases: ['PCP', 'PrimaryCarePhysician'],
    definition:
      'The network provider responsible for a member’s day-to-day care and for referring them onward.',
  },
  {
    name: 'Encounter',
    type: 'Service',
    role: 'Class',
    confidence: 0.88,
    aliases: ['EncounterRecord', 'EncounterData'],
    definition:
      'A record of a service delivered to a member by a provider, reported by the plan to the state.',
  },
  {
    name: 'ClaimLine',
    type: 'Claim',
    role: 'Class',
    confidence: 0.86,
    aliases: ['ServiceLine', 'ClaimDetailLine'],
    definition:
      'One billed service on a claim, carrying its own procedure code, units and paid amount.',
  },
  {
    name: 'PriorAuthorization',
    type: 'Policy',
    role: 'Class',
    confidence: 0.89,
    aliases: ['PriorAuth', 'PreAuthorization', 'PreCertification'],
    definition:
      'A plan decision, made before a service is delivered, that the service is covered for that member.',
  },
  {
    name: 'FormularyDrug',
    type: 'Drug',
    role: 'Class',
    confidence: 0.84,
    aliases: ['PreferredDrug', 'FormularyItem'],
    definition: 'A drug the plan covers, on the terms set out in its published formulary.',
  },
  {
    name: 'DrugRebateAgreement',
    type: 'Policy',
    role: 'Class',
    confidence: 0.81,
    aliases: ['RebateAgreement', 'NationalDrugRebateAgreement'],
    definition:
      'The agreement under which a manufacturer pays rebates on covered outpatient drugs dispensed to members.',
  },
  {
    name: 'EligibilityDetermination',
    type: 'Eligibility',
    role: 'Class',
    confidence: 0.87,
    aliases: ['EligibilityDecision', 'Determination'],
    definition:
      'The decision that an applicant does or does not qualify for coverage, with the date it takes effect.',
  },
  {
    name: 'EligibilityCategory',
    type: 'Eligibility',
    role: 'Class',
    confidence: 0.85,
    aliases: ['AidCategory', 'CoverageGroup', 'EligibilityGroup'],
    definition:
      'The basis on which a person qualifies for coverage, which drives the benefit package they receive.',
  },
  {
    name: 'FederalPovertyLevel',
    type: 'Measure',
    role: 'Attribute',
    confidence: 0.9,
    aliases: ['FPL', 'PovertyGuideline'],
    definition:
      'The income threshold, published annually, that eligibility categories are expressed as a percentage of.',
  },
  {
    name: 'EnrollmentPeriod',
    type: 'Eligibility',
    role: 'Class',
    confidence: 0.82,
    aliases: ['CoveragePeriod', 'EnrollmentSpan'],
    definition:
      'A continuous span during which a member is enrolled with one plan, bounded by a start and an end date.',
  },
  {
    name: 'Grievance',
    type: 'Process',
    role: 'Class',
    confidence: 0.79,
    aliases: ['Complaint', 'MemberGrievance'],
    definition:
      'A member’s expression of dissatisfaction about anything other than a coverage decision.',
  },
  {
    name: 'Appeal',
    type: 'Process',
    role: 'Class',
    confidence: 0.8,
    aliases: ['MemberAppeal', 'InternalAppeal'],
    definition: 'A request that the plan reconsider an adverse benefit determination it has made.',
  },
  {
    name: 'StateFairHearing',
    type: 'Process',
    role: 'Class',
    confidence: 0.76,
    aliases: ['FairHearing'],
    definition:
      'The hearing before the state a member may request once the plan’s own appeal is exhausted.',
  },
  {
    name: 'QualityMeasure',
    type: 'Measure',
    role: 'Class',
    confidence: 0.88,
    aliases: ['PerformanceMeasure', 'HEDISMeasure'],
    definition:
      'A defined calculation of how well a plan performs on one aspect of care, reported on a fixed cycle.',
  },
  {
    name: 'MedicalLossRatio',
    type: 'Measure',
    role: 'Attribute',
    confidence: 0.9,
    aliases: ['MLR'],
    definition:
      'The share of capitation revenue a plan spends on clinical services and quality improvement.',
  },
  {
    name: 'ActuarialSoundnessCertification',
    type: 'Policy',
    role: 'Class',
    confidence: 0.74,
    aliases: ['ActuarialCertification'],
    definition:
      'An actuary’s written certification that the capitation rates are adequate for the covered population.',
  },
  {
    name: 'RateCertification',
    type: 'Policy',
    role: 'Class',
    confidence: 0.77,
    aliases: ['CapitationRateCertification', 'RateCert'],
    definition:
      'The document setting out the capitation rates for a contract year and the basis they were built on.',
  },
  {
    name: 'NetworkAdequacyStandard',
    type: 'Policy',
    role: 'Class',
    confidence: 0.72,
    aliases: ['ProviderNetworkAdequacyStandard', 'TimeAndDistanceStandard'],
    definition:
      'The state’s requirement for how close and how available network providers must be to members.',
  },
  {
    name: 'ServiceAuthorizationRequest',
    type: 'Service',
    role: 'Class',
    confidence: 0.8,
    aliases: ['AuthorizationRequest', 'ServiceRequest'],
    definition: 'A request from a provider or member for the plan to authorise a specific service.',
  },
  {
    name: 'CarePlan',
    type: 'Service',
    role: 'Class',
    confidence: 0.86,
    aliases: ['PlanOfCare', 'IndividualizedCarePlan'],
    definition:
      'The agreed set of services and goals for one member, reviewed on a schedule by their care team.',
  },
  {
    name: 'CareCoordinator',
    type: 'Person',
    role: 'Class',
    confidence: 0.83,
    aliases: ['CaseManager', 'CareManager'],
    definition:
      'The person accountable for a member’s care plan and for keeping their providers in step.',
  },
  {
    name: 'HealthRiskAssessment',
    type: 'Service',
    role: 'Class',
    confidence: 0.81,
    aliases: ['HRA', 'RiskScreening'],
    definition:
      'The screening completed after enrolment that sets a member’s risk level and care needs.',
  },
  {
    name: 'LongTermServicesAndSupports',
    type: 'Benefit',
    role: 'Class',
    confidence: 0.87,
    aliases: ['LTSS', 'HomeAndCommunityBasedServices', 'HCBS'],
    definition:
      'Services that help a member with daily living over an extended period, at home or in a facility.',
  },
  {
    name: 'WaiverProgram',
    type: 'Program',
    role: 'Class',
    confidence: 0.84,
    aliases: ['HCBSWaiver', 'SectionWaiver'],
    definition:
      'A programme operating under a waiver of the standard rules, so a state can cover a defined group differently.',
  },
  {
    name: 'DemonstrationProject',
    type: 'Program',
    role: 'Class',
    confidence: 0.79,
    aliases: ['Section1115Demonstration', 'Demonstration'],
    definition:
      'A time-limited state programme approved to test an approach the standard rules would not allow.',
  },
  {
    name: 'DualEligibleIndividual',
    type: 'Person',
    role: 'Class',
    confidence: 0.91,
    aliases: ['DualEligible', 'MedicareMedicaidEnrollee'],
    definition: 'A person enrolled in both Medicare and Medicaid, with the two coordinating cover.',
  },
  {
    name: 'ThirdPartyLiability',
    type: 'Policy',
    role: 'Class',
    confidence: 0.78,
    aliases: ['TPL', 'CoordinationOfBenefits'],
    definition:
      'Another payer’s obligation to pay before Medicaid does, and the process for recovering when it did not.',
  },
  {
    name: 'ComplianceProgram',
    type: 'Program',
    role: 'Class',
    confidence: 0.73,
    aliases: ['FraudWasteAndAbuseProgram', 'FWAProgram'],
    definition:
      'The plan’s standing arrangements for detecting and reporting fraud, waste and abuse in its network.',
  },
  {
    name: 'ProgramIntegrityAudit',
    type: 'Process',
    role: 'Class',
    confidence: 0.71,
    aliases: ['PIAudit', 'ComplianceAudit'],
    definition:
      'A review of claims, encounters or providers to establish whether payments were properly made.',
  },
  {
    name: 'EncounterDataValidation',
    type: 'Process',
    role: 'Class',
    confidence: 0.69,
    aliases: ['EDV', 'EncounterValidation'],
    definition:
      'The check that the encounters a plan reports are complete and accurate against its own claims.',
  },
  {
    name: 'NationalDrugCode',
    type: 'Code',
    role: 'Attribute',
    confidence: 0.93,
    status: REVIEW_STATUS.approved,
    aliases: ['NDC'],
    definition:
      'The identifier for a specific drug, package size and labeller on a pharmacy claim.',
  },
  {
    name: 'ProcedureCode',
    type: 'Code',
    role: 'Attribute',
    confidence: 0.92,
    aliases: ['CPTCode', 'HCPCSCode'],
    definition: 'The code identifying the service performed on a claim line.',
  },
  {
    name: 'DiagnosisCode',
    type: 'Code',
    role: 'Attribute',
    confidence: 0.92,
    aliases: ['ICD10Code', 'ICDCode'],
    definition: 'The code identifying the condition a service was delivered for.',
  },
  {
    name: 'ProviderTaxonomyCode',
    type: 'Code',
    role: 'Attribute',
    confidence: 0.86,
    aliases: ['TaxonomyCode'],
    definition: 'The code describing a provider’s type, classification and area of specialisation.',
  },
  {
    name: 'NationalProviderIdentifier',
    type: 'Code',
    role: 'Attribute',
    confidence: 0.94,
    status: REVIEW_STATUS.approved,
    aliases: ['NPI'],
    definition: 'The ten-digit identifier a provider is known by across every payer.',
  },
  {
    name: 'MemberIdentifier',
    type: 'Code',
    role: 'Attribute',
    confidence: 0.9,
    aliases: ['MemberID', 'MedicaidID', 'RecipientID'],
    definition: 'The identifier a member is known by within the state’s Medicaid programme.',
  },
  {
    name: 'DateOfService',
    type: 'Temporal',
    role: 'Attribute',
    confidence: 0.89,
    aliases: ['ServiceDate', 'DOS'],
    definition:
      'The date a service was delivered, as distinct from the date it was billed or paid.',
  },
  {
    name: 'PaidAmount',
    type: 'Payment',
    role: 'Attribute',
    confidence: 0.85,
    aliases: ['AmountPaid', 'NetPaidAmount'],
    definition: 'What the plan actually paid on a claim line, after adjustments and cost sharing.',
  },
  {
    name: 'CostSharing',
    type: 'Payment',
    role: 'Class',
    confidence: 0.82,
    aliases: ['Copayment', 'Coinsurance', 'Deductible'],
    definition:
      'The share of a service’s cost a member pays themselves, within the limits the state sets.',
  },
  {
    name: 'ValueAddedService',
    type: 'Benefit',
    role: 'Class',
    confidence: 0.68,
    status: REVIEW_STATUS.rejected,
    comment: 'Too broad to model as one class — the three sources mean different things by it.',
    aliases: ['InLieuOfService', 'SupplementalBenefit'],
    definition: 'A service a plan offers beyond the covered benefit package.',
  },
  {
    name: 'SubcontractorAgreement',
    type: 'Policy',
    role: 'Class',
    confidence: 0.7,
    aliases: ['Subcontract', 'DelegatedEntityAgreement'],
    definition:
      'The agreement under which a plan delegates part of its obligations to another organization.',
  },
  {
    name: 'ReadinessReview',
    type: 'Process',
    role: 'Class',
    confidence: 0.66,
    status: REVIEW_STATUS.rejected,
    comment: 'Appears once, in a single contract appendix. Not a domain concept.',
    aliases: ['PlanReadinessReview'],
    definition: 'The state’s check that a plan can operate before members are enrolled with it.',
  },
  {
    name: 'ExternalQualityReviewOrganization',
    type: 'Organization',
    role: 'Class',
    confidence: 0.75,
    aliases: ['EQRO'],
    definition:
      'The independent organization a state contracts with to review the quality of its plans.',
  },
  {
    name: 'BeneficiarySupportSystem',
    type: 'Program',
    role: 'Class',
    confidence: 0.67,
    aliases: ['OmbudsmanProgram', 'BeneficiaryAssistance'],
    definition:
      'The help a state provides members in choosing a plan and in using the appeal process.',
  },
  {
    name: 'ProviderCredentialing',
    type: 'Process',
    role: 'Class',
    confidence: 0.83,
    aliases: ['Credentialing', 'Recredentialing'],
    definition:
      'The check of a provider’s licence, training and history before they may join a network.',
  },
  {
    name: 'BenefitPackage',
    type: 'Benefit',
    role: 'Class',
    confidence: 0.88,
    aliases: ['CoveredServicesPackage', 'BenefitPlan'],
    definition:
      'The full set of covered benefits an eligibility category entitles a member to under one contract.',
  },
];

/**
 * Fixture ids are UUID-shaped so the detail pane renders the width the API will
 * really send. The first is the one from the sample response, kept verbatim.
 */
const refId = (index) => `3a9994ae-8e10-435a-b019-b95c21c${String(index).padStart(5, '0')}`;

/** Items arrive newest first, a little under a minute apart. */
const stampedAt = (index, offsetMs = 0) =>
  new Date(Date.parse(FIRST_CREATED_AT) - index * 53_000 + offsetMs).toISOString();

function toItem(seed, index) {
  const status = seed.status ?? REVIEW_STATUS.pending;
  const decided = status !== REVIEW_STATUS.pending;
  const itemRefId = seed.id ?? refId(index);

  return {
    item_ref_id: itemRefId,
    item_type: REVIEW_ITEM_TYPE.concept,
    status,
    confidence: seed.confidence,
    reviewed_by_id: decided ? REVIEWER_ID : null,
    reviewed_at: decided ? stampedAt(index, 42 * 60_000) : null,
    review_comment: seed.comment ?? null,
    payload: {
      canonical_name: seed.name,
      aliases: JSON.stringify(seed.aliases),
      type: seed.type,
      ontology_role: seed.role,
      definition: seed.definition,
      confidence: String(seed.confidence),
      canonical_concept_id: itemRefId,
      execution_run_id: EXECUTION_RUN_ID,
      created_at: stampedAt(index),
    },
  };
}

const ITEMS = SEED.map(toItem);

/** The response body of the concept review endpoint, verbatim in shape. */
export const CONCEPT_REVIEW = toEnvelope(REVIEW_ITEM_TYPE.concept, ITEMS);

/** What the reviewer had already decided before they arrived. */
export const INITIAL_CONCEPT_DECISIONS = seedDecisions(ITEMS);
