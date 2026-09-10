# Adding the relationship gate to the API-wired repo

Your repo is at the **Concepts Page** commit with a real fetch behind
`useConceptReview.js`. This brings it to two gates without touching your API code.

**Verified:** I cloned this repo at `dfc2278`, applied the patch, and checked every
import in the result. It applies cleanly, and afterwards exactly **one** import is
unresolved — the hook you write in Step 3. Nothing else is missing.

---

## The one thing to understand

Every gate has exactly one data seam:

```
useXReview()  →  { data: { items }, isLoading }  →  everything below is pure UI
```

You already own that seam for concepts. You write one for relationships. Nothing
else in the patch knows where rows come from — which is why the patch contains
no mocks and no data hooks.

---

## Step 1 — apply the patch

```bash
cd <other-repo>
git apply --check relationship-gate.patch   # dry run
git apply         relationship-gate.patch
```

23 files. It moves the five generic components out of `ReviewConcepts/` into
`components/GateTable/`, adds `GateScreen` + `GateTable`, extracts the shared
status/confidence logic into `gateItems.js`, and adds the relationship gate.

**Untouched on purpose:** `useConceptReview.js` (yours), `conceptMocks.js`,
`ReviewProvider.jsx`, `queue.js`, `index.js`.

---

## Step 2 — adapt the relationship normalizer

`src/features/review/relationshipReview.js` — **the only file whose contents are a
guess.** I wrote it against an assumed payload:

```js
payload: {
  source_concept, relationship_type, target_concept,
  cardinality, ontology_role, definition,
  evidence,          // one-line supporting text, shown in the table column
  join_evidence,     // JSON string: [{ signal, value, detail, role }]
  signals,           // JSON string: [{ text, weight }]
  canonical_relationship_id, execution_run_id, created_at, confidence
}
```

Rewrite `normalizeRelationship` to match your real response. It must produce these
keys, because the row and the dialog read them:

| key | read by |
| --- | --- |
| `id`, `confidence`, `status` | table, filters, sorting |
| `source`, `predicate`, `target` | the three triple columns |
| `evidence` | Evidence column + dialog |
| `cardinality`, `role`, `definition` | dialog |
| `joinEvidence[]`, `signals[]` | dialog — pass `[]` if you have neither |
| `comment`, `reviewedAt`, `relationshipId`, `runId`, `createdAt` | dialog |

Nothing else reads the payload. Get this function right and the gate works.

---

## Step 3 — write the data hook

Create `src/features/review/pages/ReviewRelations/useRelationReview.js`, mirroring
whatever your `useConceptReview.js` does:

```js
import { normalizeRelationship } from '@/features/review/relationshipReview';

export function useRelationReview() {
  // ...your fetch, exactly like the concept one
  return {
    data: { items: response.items.map(normalizeRelationship) },
    isLoading,
    error,
  };
}
```

`ReviewRelations.jsx` already imports it. **This is the only missing file after
the patch** — once it exists the build is green.

---

## Step 4 — optional, when you get to them

**`ReviewProvider.jsx`** — seeds decisions the API already recorded. Add your
relationship response through `seedDecisions()` from `gateItems.js`, the same way
you did for concepts.

**`queue.js`** — the review-queue screen. Add a relationships group if you use
that screen; skip entirely if you don't.

**`index.js`** — optional hygiene: add `export * from './gateItems';` and
`export * from './relationshipReview';`. Nothing currently needs it — only
`ReviewProvider` and `SIGNAL_BANDS` are imported through the barrel.

---

## What changed for concepts

Visually nothing. `ReviewConcepts.jsx` drops from ~157 lines to ~63 because the
screen wiring moved into `GateScreen`, and `ConceptRow` now takes a generic `item`
prop instead of `concept` so one table can render either gate.

`ConceptDetail.jsx` and your `useConceptReview.js` are untouched.

---

## After this

The competency-questions gate is: a normalizer, a row, a dialog, and ~60 lines of
config in a page. The screen, table, toolbar, filters, stats, pagination, skeleton
and selection all come from `components/GateTable/`.
