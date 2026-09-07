/**
 * Hero copy. It lives here rather than in the page so Landing.jsx stays layout,
 * and so the one place a marketing line gets rewritten is a data file.
 */
export const LANDING_COPY = {
  headline: 'Turn scattered data into',
  headlineAccent: 'shared meaning.',
  cta: 'Get started',
  diagramLabel:
    'How the platform works: concepts and relations are extracted, reviewed by a person, then published as an ontology.',
};

/**
 * The four stages the hero diagram cycles through, in pipeline order — the
 * cycle walks this array, so the order is the animation.
 *
 * `x` / `y` are user units inside the 420 × 264 viewBox GraphOrbit draws into,
 * and `labelBelow` says which side of the node its caption sits on so labels
 * never collide with an edge.
 */
export const ORBIT_STAGES = [
  {
    id: 'concept',
    label: 'CONCEPT',
    x: 54,
    y: 82,
    labelBelow: false,
    note: 'Every concept traces back to the source that produced it.',
  },
  {
    id: 'relation',
    label: 'RELATION',
    x: 126,
    y: 208,
    labelBelow: true,
    note: 'Relationships carry the evidence that proposed them.',
  },
  {
    id: 'review',
    label: 'REVIEW',
    x: 224,
    y: 152,
    labelBelow: true,
    note: "Human judgement is preserved as part of the graph's provenance.",
  },
  {
    id: 'ontology',
    label: 'ONTOLOGY',
    x: 368,
    y: 82,
    labelBelow: false,
    note: 'What survives review is published as one versioned vocabulary.',
  },
];

/**
 * The shape of the graph. There is deliberately no edge from the last stage
 * back to the first: the pipeline ends at a published ontology, so the cycle
 * rests on it for a beat and starts over rather than drawing a loop that the
 * product does not actually have.
 */
export const ORBIT_EDGES = [
  { from: 'concept', to: 'relation' },
  { from: 'concept', to: 'review' },
  { from: 'relation', to: 'review' },
  { from: 'review', to: 'ontology' },
];

export const ORBIT_VIEWBOX = { width: 420, height: 264 };

/** Long enough to read the caption under the diagram before it changes. */
export const ORBIT_CYCLE_MS = 2600;
