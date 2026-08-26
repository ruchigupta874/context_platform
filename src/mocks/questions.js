import { DECISION } from '../config/constants/common';
import { COVERAGE } from '../config/constants/questions';

const { covered, partial, notCovered } = COVERAGE;

export const QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    theme: 'Billing',
    coverage: covered,
    text: 'Which customers hold more than one active contract?',
    origin: 'Drafted from the Customer and Contract classes',
    originIcon: 'node',
    requires: [
      { id: 'rq1', name: 'ex:Customer', kind: 'class', status: 'approved' },
      { id: 'rq2', name: 'ex:Contract', kind: 'class', status: 'approved' },
      { id: 'rq3', name: 'ex:holds', kind: 'object property', status: 'approved' },
    ],
    query: `SELECT ?customer (COUNT(?contract) AS ?n)
WHERE {
  ?customer a ex:Customer ;
            ex:holds ?contract .
  ?contract ex:status "active" .
}
GROUP BY ?customer
HAVING (COUNT(?contract) > 1)`,
  },
  {
    id: 'q2',
    number: 2,
    theme: 'Billing',
    coverage: covered,
    text: 'What is the total outstanding balance for a customer across all of their contracts?',
    origin: 'Billing Domain Glossary.docx, §3 — stated as a reporting need',
    originIcon: 'doc',
    requires: [
      { id: 'rq1', name: 'ex:Customer', kind: 'class', status: 'approved' },
      { id: 'rq2', name: 'ex:Invoice', kind: 'class', status: 'approved' },
      { id: 'rq3', name: 'ex:generates', kind: 'object property', status: 'approved' },
      { id: 'rq4', name: 'ex:settledBy', kind: 'object property', status: 'pending' },
    ],
    query: `SELECT ?customer (SUM(?due - ?paid) AS ?balance)
WHERE {
  ?customer ex:holds ?contract .
  ?contract ex:generates ?invoice .
  ?invoice  ex:amountDue ?due .
  OPTIONAL { ?invoice ex:settledBy/ex:amount ?paid }
}
GROUP BY ?customer`,
  },
  {
    id: 'q3',
    number: 3,
    theme: 'Billing',
    coverage: covered,
    text: 'Which invoices remain unsettled more than 30 days after issue?',
    origin: 'Drafted from the Invoice and Payment classes',
    originIcon: 'node',
    requires: [
      { id: 'rq1', name: 'ex:Invoice', kind: 'class', status: 'approved' },
      { id: 'rq2', name: 'ex:Payment', kind: 'class', status: 'approved' },
      { id: 'rq3', name: 'ex:settledBy', kind: 'object property', status: 'pending' },
    ],
    query: `SELECT ?invoice ?issuedOn ?due
WHERE {
  ?invoice a ex:Invoice ;
           ex:issuedOn ?issuedOn ;
           ex:amountDue ?due .
  FILTER NOT EXISTS { ?invoice ex:settledBy ?p }
  FILTER (?issuedOn < (NOW() - "P30D"^^xsd:duration))
}`,
  },
  {
    id: 'q4',
    number: 4,
    theme: 'Claims',
    coverage: partial,
    text: 'How many claims did a customer file in the last twelve months, and how many were upheld?',
    origin: 'Claims Handling Policy v3.pdf, p.12 — named as a reporting obligation',
    originIcon: 'doc',
    requires: [
      { id: 'rq1', name: 'ex:Customer', kind: 'class', status: 'approved' },
      { id: 'rq2', name: 'ex:Claim', kind: 'class', status: 'pending' },
      { id: 'rq3', name: 'ex:files', kind: 'object property', status: 'pending' },
      { id: 'rq4', name: 'ex:ClaimAssessment', kind: 'class', status: 'missing' },
    ],
    query: `SELECT ?customer (COUNT(?claim) AS ?filed)
                 (SUM(IF(?outcome = "upheld", 1, 0)) AS ?upheld)
WHERE {
  ?customer ex:files ?claim .
  ?claim    ex:filedOn ?filedOn .
  OPTIONAL { ?claim ex:assessedBy/ex:outcome ?outcome }
  FILTER (?filedOn > (NOW() - "P12M"^^xsd:duration))
}
GROUP BY ?customer`,
  },
  {
    id: 'q5',
    number: 5,
    theme: 'Service',
    coverage: covered,
    text: 'Which agents handled the most billing-related calls last quarter?',
    origin: 'Drafted from the Interaction, Call and Agent classes',
    originIcon: 'node',
    requires: [
      { id: 'rq1', name: 'ex:Call', kind: 'class', status: 'pending' },
      { id: 'rq2', name: 'ex:Agent', kind: 'class', status: 'pending' },
      { id: 'rq3', name: 'ex:handledBy', kind: 'object property', status: 'pending' },
    ],
    query: `SELECT ?agent (COUNT(?call) AS ?handled)
WHERE {
  ?call a ex:Call ;
        ex:queue "billing_l1" ;
        ex:handledBy ?agent .
}
GROUP BY ?agent
ORDER BY DESC(?handled)
LIMIT 20`,
  },
  {
    id: 'q6',
    number: 6,
    theme: 'Service',
    coverage: covered,
    text: 'What proportion of interactions are resolved without an agent ever being involved?',
    origin: 'Contact Centre Taxonomy.xlsx — self-service reporting line',
    originIcon: 'doc',
    requires: [
      { id: 'rq1', name: 'ex:Interaction', kind: 'class', status: 'pending' },
      { id: 'rq2', name: 'ex:handledBy', kind: 'object property', status: 'pending' },
    ],
    query: `SELECT (COUNT(?self) / COUNT(?all) AS ?selfServeRate)
WHERE {
  ?all a ex:Interaction .
  OPTIONAL {
    ?self a ex:Interaction .
    FILTER NOT EXISTS { ?self ex:handledBy ?agent }
  }
}`,
  },
  {
    id: 'q7',
    number: 7,
    theme: 'Billing',
    coverage: notCovered,
    text: 'Which contracts are priced under a tariff that has since been withdrawn?',
    origin: 'Billing Domain Glossary.docx, §4 — tariff lifecycle',
    originIcon: 'doc',
    requires: [
      { id: 'rq1', name: 'ex:Contract', kind: 'class', status: 'approved' },
      { id: 'rq2', name: 'ex:Tariff', kind: 'class', status: 'missing' },
      { id: 'rq3', name: 'ex:pricedBy', kind: 'object property', status: 'missing' },
    ],
    query: `SELECT ?contract ?tariff
WHERE {
  ?contract a ex:Contract ;
            ex:pricedBy ?tariff .
  ?tariff   ex:withdrawnOn ?withdrawn .
}

# ex:Tariff has no source table in this run.
# Add a tariff reference table and re-run to answer this.`,
  },
  {
    id: 'q8',
    number: 8,
    theme: 'Customer',
    coverage: covered,
    text: 'For a given customer, what is the full history of contacts leading up to a claim?',
    origin: 'Drafted by joining the Interaction and Claim paths',
    originIcon: 'node',
    requires: [
      { id: 'rq1', name: 'ex:Customer', kind: 'class', status: 'approved' },
      { id: 'rq2', name: 'ex:Interaction', kind: 'class', status: 'pending' },
      { id: 'rq3', name: 'ex:Claim', kind: 'class', status: 'pending' },
      { id: 'rq4', name: 'ex:participatesIn', kind: 'object property', status: 'pending' },
    ],
    query: `SELECT ?interaction ?occurredAt ?channel
WHERE {
  ?customer ex:files ?claim ;
            ex:participatesIn ?interaction .
  ?claim       ex:filedOn ?filedOn .
  ?interaction ex:occurredAt ?occurredAt ;
               ex:channel ?channel .
  FILTER (?occurredAt < ?filedOn)
}
ORDER BY ?occurredAt`,
  },
  {
    id: 'q9',
    number: 9,
    theme: 'Customer',
    coverage: notCovered,
    text: 'Which customers share a service address with another customer?',
    origin: 'Drafted from inferred address clustering',
    originIcon: 'node',
    requires: [
      { id: 'rq1', name: 'ex:Customer', kind: 'class', status: 'approved' },
      { id: 'rq2', name: 'ex:ServiceAddress', kind: 'class', status: 'missing' },
      { id: 'rq3', name: 'ex:residesAt', kind: 'object property', status: 'missing' },
    ],
    query: `SELECT ?address (GROUP_CONCAT(?customer) AS ?customers)
WHERE {
  ?customer ex:residesAt ?address .
}
GROUP BY ?address
HAVING (COUNT(?customer) > 1)

# Address clustering was rejected at the concept gate.`,
  },
  {
    id: 'q10',
    number: 10,
    theme: 'Claims',
    coverage: partial,
    text: 'What is the average time from claim submission to resolution, broken down by claim type?',
    origin: 'Claims Handling Policy v3.pdf, p.14 — service level target',
    originIcon: 'doc',
    requires: [
      { id: 'rq1', name: 'ex:Claim', kind: 'class', status: 'pending' },
      { id: 'rq2', name: 'ex:claimType', kind: 'datatype property', status: 'pending' },
      { id: 'rq3', name: 'ex:ClaimAssessment', kind: 'class', status: 'missing' },
    ],
    query: `SELECT ?claimType (AVG(?resolvedAt - ?filedOn) AS ?avgDays)
WHERE {
  ?claim a ex:Claim ;
         ex:claimType ?claimType ;
         ex:filedOn ?filedOn ;
         ex:resolvedAt ?resolvedAt .
}
GROUP BY ?claimType`,
  },
  {
    id: 'q11',
    number: 11,
    theme: 'Billing',
    coverage: covered,
    text: 'Which invoices were only partially settled, and by how much are they short?',
    origin: 'Drafted from the Payment fan-out analysis',
    originIcon: 'node',
    requires: [
      { id: 'rq1', name: 'ex:Invoice', kind: 'class', status: 'approved' },
      { id: 'rq2', name: 'ex:Payment', kind: 'class', status: 'approved' },
      { id: 'rq3', name: 'ex:settledBy', kind: 'object property', status: 'pending' },
    ],
    query: `SELECT ?invoice (?due - SUM(?paid) AS ?shortfall)
WHERE {
  ?invoice a ex:Invoice ;
           ex:amountDue ?due ;
           ex:settledBy ?payment .
  ?payment ex:amount ?paid .
}
GROUP BY ?invoice ?due
HAVING (SUM(?paid) < ?due)`,
  },
  {
    id: 'q12',
    number: 12,
    theme: 'Billing',
    coverage: partial,
    text: 'How many contracts does each billing account carry, and which of them are inactive?',
    origin: 'Drafted from the repeated billing_ref column',
    originIcon: 'node',
    requires: [
      { id: 'rq1', name: 'ex:BillingAccount', kind: 'class', status: 'pending' },
      { id: 'rq2', name: 'ex:Contract', kind: 'class', status: 'approved' },
      { id: 'rq3', name: 'ex:billedUnder', kind: 'object property', status: 'missing' },
    ],
    query: `SELECT ?account (COUNT(?contract) AS ?total)
                (SUM(IF(?status != "active", 1, 0)) AS ?inactive)
WHERE {
  ?contract ex:billedUnder ?account ;
            ex:status ?status .
}
GROUP BY ?account`,
  },
];

export const INITIAL_QUESTION_DECISIONS = {
  q1: DECISION.approved,
  q2: DECISION.approved,
  q3: DECISION.approved,
  q5: DECISION.approved,
  q9: DECISION.rejected,
};
