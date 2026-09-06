export const ONTOLOGY_TREE = [
  { id: 'owl:Thing', name: 'owl:Thing', depth: 0, parent: null, instances: '' },
  { id: 'Party', name: 'Party', depth: 1, parent: 'owl:Thing', instances: '485k' },
  { id: 'Customer', name: 'Customer', depth: 2, parent: 'Party', instances: '482k' },
  { id: 'Agent', name: 'Agent', depth: 2, parent: 'Party', instances: '2.4k' },
  { id: 'Agreement', name: 'Agreement', depth: 1, parent: 'owl:Thing', instances: '611k' },
  { id: 'Contract', name: 'Contract', depth: 2, parent: 'Agreement', instances: '611k' },
  {
    id: 'FinancialDocument',
    name: 'FinancialDocument',
    depth: 1,
    parent: 'owl:Thing',
    instances: '14.1m',
  },
  { id: 'Invoice', name: 'Invoice', depth: 2, parent: 'FinancialDocument', instances: '7.2m' },
  { id: 'Payment', name: 'Payment', depth: 2, parent: 'FinancialDocument', instances: '6.9m' },
  { id: 'Interaction', name: 'Interaction', depth: 1, parent: 'owl:Thing', instances: '3.1m' },
  { id: 'Call', name: 'Call', depth: 2, parent: 'Interaction', instances: '1.8m' },
  { id: 'ChatSession', name: 'ChatSession', depth: 2, parent: 'Interaction', instances: '740k' },
  { id: 'Claim', name: 'Claim', depth: 1, parent: 'owl:Thing', instances: '94k' },
  { id: 'BillingAccount', name: 'BillingAccount', depth: 1, parent: 'owl:Thing', instances: '38k' },
];

export const DEFAULT_EXPANDED = [
  'owl:Thing',
  'Party',
  'Agreement',
  'FinancialDocument',
  'Interaction',
];

export const CLASS_DETAILS = {
  Customer: {
    name: 'Customer',
    parent: 'ex:Party',
    instances: '482k',
    definition:
      'A party that holds one or more service contracts and is billed against them. Includes residential and small-business account holders, and excludes internal test accounts.',
    objectProperties: [
      {
        id: 'o1',
        name: 'ex:holds',
        range: 'ex:Contract',
        cardinality: '0..*',
        inverse: 'ex:heldBy',
      },
      { id: 'o2', name: 'ex:files', range: 'ex:Claim', cardinality: '0..*', inverse: 'ex:filedBy' },
      {
        id: 'o3',
        name: 'ex:participatesIn',
        range: 'ex:Interaction',
        cardinality: '0..*',
        inverse: 'ex:involves',
      },
      {
        id: 'o4',
        name: 'ex:billedUnder',
        range: 'ex:BillingAccount',
        cardinality: '1..1',
        inverse: 'ex:covers',
      },
    ],
    dataProperties: [
      {
        id: 'd1',
        name: 'ex:customerId',
        type: 'xsd:long',
        from: 'customer.customer_id',
        required: true,
      },
      {
        id: 'd2',
        name: 'ex:fullName',
        type: 'xsd:string',
        from: 'customer.full_name',
        required: true,
      },
      {
        id: 'd3',
        name: 'ex:segment',
        type: 'xsd:string',
        from: 'customer.segment',
        required: false,
      },
      {
        id: 'd4',
        name: 'ex:createdAt',
        type: 'xsd:dateTime',
        from: 'customer.created_at',
        required: true,
      },
    ],
    axioms: [
      { id: 'a1', text: 'Customer rdfs:subClassOf Party', tag: 'inherited' },
      { id: 'a2', text: 'ex:customerId a owl:InverseFunctionalProperty', tag: 'key' },
      { id: 'a3', text: 'Customer owl:disjointWith Agent', tag: 'disjoint' },
      {
        id: 'a4',
        text: 'Customer rdfs:subClassOf (ex:billedUnder exactly 1 BillingAccount)',
        tag: 'unverified',
      },
    ],
    mapping: `<#CustomerMap>
  rr:logicalTable [ rr:tableName "prod_uc.cust360.customer" ] ;
  rr:subjectMap [
    rr:template "https://ctx.internal/id/customer/{customer_id}" ;
    rr:class    ex:Customer ;
  ] ;
  rr:predicateObjectMap [
    rr:predicate  ex:fullName ;
    rr:objectMap  [ rr:column "full_name" ] ;
  ] .`,
  },
  Contract: {
    name: 'Contract',
    parent: 'ex:Agreement',
    instances: '611k',
    definition:
      'A signed service agreement between the business and a customer, valid over a date range and carrying the terms that invoices are raised against.',
    objectProperties: [
      {
        id: 'o1',
        name: 'ex:heldBy',
        range: 'ex:Customer',
        cardinality: '1..1',
        inverse: 'ex:holds',
      },
      {
        id: 'o2',
        name: 'ex:generates',
        range: 'ex:Invoice',
        cardinality: '0..*',
        inverse: 'ex:raisedUnder',
      },
    ],
    dataProperties: [
      {
        id: 'd1',
        name: 'ex:contractId',
        type: 'xsd:long',
        from: 'contract.contract_id',
        required: true,
      },
      {
        id: 'd2',
        name: 'ex:startDate',
        type: 'xsd:date',
        from: 'contract.start_date',
        required: true,
      },
      {
        id: 'd3',
        name: 'ex:endDate',
        type: 'xsd:date',
        from: 'contract.end_date',
        required: false,
      },
      { id: 'd4', name: 'ex:status', type: 'xsd:string', from: 'contract.status', required: true },
    ],
    axioms: [
      { id: 'a1', text: 'Contract rdfs:subClassOf Agreement', tag: 'inherited' },
      {
        id: 'a2',
        text: 'Contract rdfs:subClassOf (ex:heldBy exactly 1 Customer)',
        tag: 'cardinality',
      },
      { id: 'a3', text: 'ex:endDate rdfs:range xsd:date', tag: 'range' },
    ],
    mapping: `<#ContractMap>
  rr:logicalTable [ rr:tableName "prod_uc.cust360.contract" ] ;
  rr:subjectMap [
    rr:template "https://ctx.internal/id/contract/{contract_id}" ;
    rr:class    ex:Contract ;
  ] ;
  rr:predicateObjectMap [
    rr:predicate ex:heldBy ;
    rr:objectMap [
      rr:parentTriplesMap <#CustomerMap> ;
      rr:joinCondition [
        rr:child "customer_id" ; rr:parent "customer_id" ;
      ] ;
    ] ;
  ] .`,
  },
  Invoice: {
    name: 'Invoice',
    parent: 'ex:FinancialDocument',
    instances: '7.2m',
    definition:
      'A billing document issued against a contract for one billing period, listing charges and the amount due.',
    objectProperties: [
      {
        id: 'o1',
        name: 'ex:raisedUnder',
        range: 'ex:Contract',
        cardinality: '1..1',
        inverse: 'ex:generates',
      },
      {
        id: 'o2',
        name: 'ex:settledBy',
        range: 'ex:Payment',
        cardinality: '0..*',
        inverse: 'ex:settles',
      },
    ],
    dataProperties: [
      {
        id: 'd1',
        name: 'ex:invoiceId',
        type: 'xsd:long',
        from: 'invoice.invoice_id',
        required: true,
      },
      {
        id: 'd2',
        name: 'ex:amountDue',
        type: 'xsd:decimal',
        from: 'invoice.amount_due',
        required: true,
      },
      {
        id: 'd3',
        name: 'ex:issuedOn',
        type: 'xsd:date',
        from: 'invoice.issued_on',
        required: true,
      },
    ],
    axioms: [
      { id: 'a1', text: 'Invoice rdfs:subClassOf FinancialDocument', tag: 'inherited' },
      { id: 'a2', text: 'ex:amountDue rdfs:range xsd:decimal', tag: 'range' },
      { id: 'a3', text: '14k instances violate (ex:raisedUnder exactly 1)', tag: 'violated' },
    ],
    mapping: `<#InvoiceMap>
  rr:logicalTable [ rr:tableName "prod_uc.cust360.invoice" ] ;
  rr:subjectMap [
    rr:template "https://ctx.internal/id/invoice/{invoice_id}" ;
    rr:class    ex:Invoice ;
  ] ;
  rr:predicateObjectMap [
    rr:predicate ex:amountDue ;
    rr:objectMap [ rr:column "amount_due" ; rr:datatype xsd:decimal ] ;
  ] .`,
  },
};

export const ONTOLOGY_STATS = [
  { id: 'classes', label: 'Classes', value: '14' },
  { id: 'objectProps', label: 'Object props', value: '16' },
  { id: 'dataProps', label: 'Datatype props', value: '41' },
  { id: 'axioms', label: 'Axioms', value: '23' },
];

export const QUESTION_COVERAGE = { answerable: 18, partial: 3, total: 24 };

export const VALIDATION_FINDINGS = [
  {
    id: 'v1',
    tone: 'danger',
    title: '14k invoices have no contract',
    detail:
      'Violates the exactly-one cardinality on ex:raisedUnder. Migration-era rows, needs a rule before publishing.',
  },
  {
    id: 'v2',
    tone: 'warn',
    title: 'Agent has no definition source',
    detail:
      'Neither the catalog nor any uploaded document defines the term. Consider adding a description.',
  },
  {
    id: 'v3',
    tone: 'warn',
    title: 'ChatSession has no competency question',
    detail: 'Nothing in the approved question set exercises this class.',
  },
  {
    id: 'v4',
    tone: 'info',
    title: '3 classes reuse ContactCentre v7 IRIs',
    detail:
      'Interaction, Call and Agent align with the published ontology, so queries carry across workspaces.',
  },
];

export const AXIOM_TONES = {
  violated: 'danger',
  unverified: 'danger',
  key: 'info',
  cardinality: 'info',
  inherited: 'neutral',
  disjoint: 'neutral',
  range: 'neutral',
};
