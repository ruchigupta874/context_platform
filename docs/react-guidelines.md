# React Guidelines — context_platform

The single reference for how this codebase should be structured and written.
Each section states **the rule**, **what this repo does today**, and **what to
change**.

Hand this to Claude with: _"Follow docs/react-guidelines.md."_ For a full
restructure, work through **The plan** at the bottom — one step at a time.

**Out of scope by decision, not oversight:** automated tests, and a TypeScript
migration. Both are deferred deliberately; see [Deferred](#deferred).

---

## What this codebase is missing

The naming, the token system, and the component boundaries are already good. The
gaps are enforcement, folder topology, and a data layer.

| Gap                                                          | Where                      |
| ------------------------------------------------------------ | -------------------------- |
| No prop contracts on 38 components                           | [§4](#4-components)        |
| Features spread across six top-level folders                 | [§1](#1-folder-structure)  |
| 183 deep relative imports (`../../../`)                      | [§2](#2-imports)           |
| Every component file named `index.jsx` (20 of them)          | [§4](#4-components)        |
| Pages import fixtures directly; the API layer is dead code   | [§5](#5-state-and-data)    |
| No error boundary — one throw white-screens the app          | [§5](#5-state-and-data)    |
| No code splitting — the graph ships to everyone              | [§5](#5-state-and-data)    |
| Hardcoded hex colours, static values in `style={{}}`         | [§6](#6-styling)           |
| No overlay widgets built; 4 dead `chevronDown` placeholders  | [§7](#7-ui-widgets--radix) |
| `SegmentedControl` claims tab semantics it doesn't implement | [§8](#8-accessibility)     |
| No Prettier, no jsx-a11y, no import ordering, no CI          | [§9](#9-tooling)           |

---

## 1. Folder structure

**Rule:** organise by **feature**, not by file type. A feature owns its pages,
components, hooks, constants and data together.

**Today:** type-based (`components/`, `pages/`, `hooks/`, `context/`,
`config/`, `mocks/`). That was right at the start and has now outgrown itself:

| Feature  | Folders it currently spans                                                   |
| -------- | ---------------------------------------------------------------------------- |
| `review` | `components/`, `config/`, `context/`, `hooks/`, `mocks/`, `pages/` — **six** |
| `runs`   | `components/`, `config/`, `mocks/`, `pages/`, `layout/` — **five**           |

Adding one field to a review concept means editing four files in four
directories. `components/pipeline/` and `components/review/` are already feature
folders wearing a type folder's name — the structure has been drifting this way
on its own.

**Change to:**

```
src/
├── app/              App.jsx, Providers.jsx, router.jsx, ErrorBoundary.jsx
├── features/
│   ├── workspaces/   WorkspaceRegistry page, workspace context + hook, constants, mocks
│   ├── sources/      Sources page, constants, mocks
│   ├── runs/         Runs · RunDetail · NewRun pages, RunShell, pipeline components,
│   │                 runs + pipeline constants, mocks
│   ├── review/       ReviewConcepts · ReviewQuestions · ReviewQueue pages,
│   │                 ReviewGate, ReviewItem, DecisionActions, review context + hooks,
│   │                 review + questions constants, mocks
│   ├── ontology/     Ontology page, mocks
│   └── graph/        KnowledgeGraph page, graph constants, mocks
├── components/
│   ├── ui/           the 10 primitives + Icon   (unchanged — genuinely generic)
│   └── layout/       AppShell, Sidebar, TopBar, PageHeader
├── hooks/            useSelection only (genuinely cross-feature)
├── lib/              api.js, endpoints.js  (moved from utils/)
├── config/           navigation.js, constants/common.js (TONE, DENSITY, DECISION)
├── routes/           paths.js
├── styles/           tokens.css, base.css
└── utils/            format.js
```

**Rules that keep it working:**

- **A feature may not reach into another feature's internals.** Import from
  `@/features/runs`, never `@/features/runs/components/RunCard`. Each feature
  exposes an `index.js` barrel; everything else is private.
- **Shared means used by two features.** If a second feature needs something, it
  moves up to `components/`, `hooks/`, or `lib/` — it does not get imported
  sideways.
- **`components/ui` is a design system, not a junk drawer.** A component belongs
  there only if it would make sense in a different product. `Button` yes,
  `ReviewGate` no.
- **`RunShell` belongs in `features/runs/`** — it is a run-specific layout.
  `AppShell`, `Sidebar`, `TopBar`, `PageHeader` stay in `components/layout/`.
- **Colocate on first use, promote on second.** Not in anticipation.
- **Depth limit: 4.**

---

## 2. Imports

**Rule:** absolute aliases for anything outside the current folder; relative only
for siblings.

**Today:** 183 imports like `from '../../../config/constants/runs'`. Moving any
file breaks a chain of them, and the depth hides where things come from.

**Change to:**

```js
import Button from '@/components/ui/Button'; // cross-folder → alias
import { RUN_STATUS } from '@/features/runs'; // feature → its barrel
import styles from './RunCard.module.css'; // sibling → relative
```

Set it up in `vite.config.js`:

```js
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
```

and in `jsconfig.json` at the repo root, so the editor agrees:

```json
{
  "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } },
  "include": ["src"]
}
```

**Also:**

- Enforce order with `eslint-plugin-import`: builtin → external → internal
  (`@/**`) → sibling → styles last.
- **Barrels only at feature boundaries.** Do not add an `index.js` that re-exports
  every component in `components/ui` — that defeats tree-shaking and creates
  import cycles. One barrel per feature, exporting its public surface.
- No circular imports. If two features need each other, the shared part belongs
  one level up.

---

## 3. Constants

**Rule:** anything with a fixed set of values, any string appearing twice, any
magic number, and any user-facing copy lives in a constants file — scoped to its
feature.

**Today:** genuinely good. `config/constants/` is split by domain with a barrel
and real explanatory comments. Two things to fix: some feature logic sits in
pages (`pages/ReviewQueue/queue.js`, `pages/Sources/sourceStatus.js`), and there
are still bare string comparisons in the code.

**The pattern — enum plus its presentation, together:**

```js
// features/runs/constants.js
export const RUN_STATUS = {
  queued: 'queued',
  running: 'running',
  failed: 'failed',
};

export const RUN_STATUS_META = {
  [RUN_STATUS.queued]: { label: 'Queued', tone: TONE.neutral, icon: 'clock' },
  [RUN_STATUS.running]: { label: 'Running', tone: TONE.info, icon: 'spinner' },
  [RUN_STATUS.failed]: { label: 'Failed', tone: TONE.danger, icon: 'alert' },
};
```

**Rules:**

- **Never compare against a literal.** `status === RUN_STATUS.failed`, never
  `status === 'failed'`. Grep for `=== '` and `!== '` and fix every hit — the
  constant is what turns a typo into a visible break instead of a silent falsy
  branch.
- **Prefer a lookup map over a switch or if-chain** for status → presentation.
  Adding a status should mean adding a row, not editing five components.
- **Feed `PropTypes.oneOf` from the constant**, never a hand-typed list:
  `tone: PropTypes.oneOf(Object.values(TONE))`.
- **Scope to the feature.** Only genuinely cross-cutting values — `TONE`,
  `DENSITY`, `DECISION`, breakpoints — stay in `config/constants/common.js`.
- **Don't hoist single-use values.** A number used once, in one place, whose
  meaning is obvious in context, is clearer inline. Hoisting it only adds a jump.
- **Environment values go through one module** (`config/env.js`), validated at
  startup. Never scatter `import.meta.env.X`. Ship a `.env.example` —
  `VITE_API_BASE` is read but undocumented today.

---

## 4. Components

**Rule:** one job per component, a real filename, and a prop contract.

### Prop contracts — the biggest single gap

**Today:** no TypeScript and no PropTypes on any of 38 components. Nothing
catches a renamed or mistyped prop; it surfaces as `undefined` at runtime.

**Change to:** `prop-types` on every component in `components/ui/`,
`components/layout/`, and each feature's shared components. Write real shapes:

```js
SegmentedControl.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      count: PropTypes.number,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['md', 'lg']),
};
```

Pages are exempt — they take no props. **Expect console warnings when you add
these; that is the point.** Fix the caller, not the declaration, unless the
declaration is genuinely wrong.

### Filenames

**Today:** 20 files named `index.jsx`. Editor tabs and fuzzy-find are unusable.

**Change to** — real name plus a barrel, so import paths don't change:

```
ReviewGate/
├── ReviewGate.jsx
├── ReviewGate.module.css
└── index.js        →  export { default } from './ReviewGate';
```

Also give the three flat components folders like everything else: `Icon.jsx`,
`RunOutputEmpty.jsx`, `DecisionActions.jsx`.

### Naming

| Thing     | Convention                     | Example                    |
| --------- | ------------------------------ | -------------------------- |
| Component | PascalCase, file matches       | `ReviewGate.jsx`           |
| Hook      | `use` + camelCase              | `useReviewContext.js`      |
| Module    | camelCase                      | `formatDuration.js`        |
| Constant  | SCREAMING_SNAKE_CASE           | `MAX_UPLOAD_BYTES`         |
| CSS class | camelCase, role not appearance | `.listHead` not `.greyRow` |

- **Booleans read as questions:** `isLoading`, `hasError`, `canApprove`. Never
  negatives (`isNotReady`).
- **Handlers:** prop is `onSomething`, implementation is `handleSomething`.
- **Functions are verbs:** `fetchRuns`, `mapRunToRow`. Not `runData`.
- **Say the domain word:** `selectedConceptIds`, not `items` or `data`.
- **Same concept, same word everywhere** — API, component, CSS class, all say
  `concept`.
- **Rename the two confusing hooks:** `useDecisions` → `useDecisionState`
  (local state), `useReviewDecisions` → `useReviewContext` (reads context).

### Size and shape

- **Under 150 lines**, hard stop 250. Five files exceed it today:
  `KnowledgeGraph` (390), `Overview` (373), `Ontology` (285), `NewRun` (265),
  `ReviewConcepts` (250).
- **Split along real seams**, in this order: extract a **hook** if the bulk is
  state → extract a **child component** if a JSX block has its own props →
  extract a **util** if it is pure computation. Never split by line count into
  `PartOne`/`PartTwo` — that makes two coupled components instead of one clear
  one. If a component is long but genuinely cohesive, leave it.
- **Max ~7 props.** More means too many jobs, or the props should be one object.
- **Booleans should not multiply.** Three booleans is eight states, most
  nonsense. Use `variant="primary" | "secondary" | "ghost"`.
- **Composition over configuration** — `children` and slots beat
  `renderHeader` / `showFooter` / `footerText` chains.
- **A component must not know where it sits.** No margin, no `position:
absolute`, no fixed width inside a reusable component. Spacing is the parent's
  job.
- **Rule of three.** Copy once; extract on the third occurrence. Extracting after
  the first copy usually produces the wrong abstraction — and a wrong abstraction
  costs more than duplication.

---

## 5. State and data

### Classify state before placing it

| Kind                | Lives in                 | Example                   |
| ------------------- | ------------------------ | ------------------------- |
| Server data         | fetch layer              | run list, concepts        |
| URL state           | the route                | `?tab=concepts`, `:runId` |
| Global client state | Context                  | current workspace         |
| Local UI state      | `useState`               | dropdown open, hover      |
| Derived state       | **nothing — compute it** | filtered list, totals     |

**Derived state is the most common mistake:**

```jsx
// Wrong — two sources of truth, one render behind
const [filtered, setFiltered] = useState([]);
useEffect(() => setFiltered(runs.filter(isActive)), [runs]);

// Right
const filtered = useMemo(() => runs.filter(isActive), [runs]);
```

- `useEffect` is for **synchronising with something outside React** — a
  subscription, a timer, the DOM, an API. Not for computing values. Most
  `useEffect` in a codebase should not exist.
- **Push state down**, not up. The smallest subtree that needs it owns it.
- **Prop drilling past 2 levels** → composition first, context second.
- **Split contexts by update frequency.** One context holding both a workspace id
  and a live progress counter re-renders everything on every tick.
- **Memoise context values**, or every consumer re-renders on every parent render.
- **Every context gets a hook that throws** outside its provider. Never export the
  raw context. _(This repo already does this correctly.)_

### The data layer

**Today:** `utils/api.js` and `utils/endpoints.js` are well-built — client with
abort handling, `ApiError`, every endpoint mapped — and **nothing imports
either.** They are dead code. Meanwhile 12 modules import fixtures straight from
`src/mocks/`, including both providers.

Because mocks are synchronous module imports, **no page has a loading, error, or
empty state** — those code paths don't exist, and all 12 files change the day the
backend lands.

**Change to** — a hook between page and data:

```
lib/apiClient.js            fetch, headers, errors, abort   (already written)
features/runs/api/getRuns.js   one function per endpoint
features/runs/hooks/useRuns.js → { data, isLoading, error }
```

Components call hooks. Hooks call fetchers. Fetchers call the client. **No
component calls `fetch`; no page imports a fixture.** While there's no backend,
the fetcher returns `mockRequest(RUNS)` — which `utils/api.js` already provides,
with simulated latency, precisely so loading states are real code paths. When the
API arrives, only the fetcher changes.

Every async surface handles **four** states: loading, error, empty, data. Empty
is not loading.

### Resilience

- **`ErrorBoundary` at the app root and per route.** One throw currently
  white-screens the whole app. `KnowledgeGraph` dereferences
  `nodesById[otherId].label` unguarded — a missing node is a crash.
- **Route-level `React.lazy` + `Suspense`.** Nothing is code-split today; someone
  opening the run list downloads the graph renderer.
- Abort in-flight requests on unmount. Never swallow an error in an empty
  `catch`.

---

## 6. Styling

### Tailwind — no. Keep CSS Modules.

You asked whether to add it. **Don't.**

You have **28 CSS module files and 4,884 lines of working, consistent CSS**, plus
a mature semantic token layer in `tokens.css`. Tailwind's real wins — no naming,
colocation, velocity on a blank page — are wins you've already banked by other
means. Adopting it costs one of:

- **Full migration:** rewrite ~4,600 lines of component CSS for zero functional
  gain, with no tests to catch what breaks visually.
- **Coexistence:** two styling systems and two token vocabularies
  (`--text-3` vs `text-gray-500`) in one codebase, and an arbitrary "which
  system?" decision on every new component. Strictly worse than either alone.

Your tokens are also _semantic_ (`--text-3`, `--ok-tint`, `--accent-ring`), which
is a level of intent Tailwind's utility classes don't express.

**Tailwind would be right** on a greenfield project, or a team that keeps drifting
on CSS conventions, or if you were adopting a Tailwind-based component ecosystem
wholesale. None of those apply.

### The rules

- **Tokens are the only source** of colour, spacing, radius, and type. A raw hex
  in a component is a bug.
  **Today:** `#b4b4be`, `#dcdce3`, `#16161d`, `#ffffff` in
  `KnowledgeGraph/index.jsx:232-296`. Add `--graph-edge`, `--graph-node-stroke`
  etc. to `tokens.css` — SVG attributes accept `var()` fine.
- **Spacing comes from a scale** (4/8/12/16/24/32).
- **`style={{}}` only for runtime-computed values.**
  **Keep:** `gridTemplateColumns` in `DataTable`, `width: %` in `ProgressBar`,
  the computed indent in `Ontology`, entity colours in `KnowledgeGraph`.
  **Remove — seven static ones:** `marginTop: 7`, `marginBottom: 4` (×2),
  `marginTop: 8`, `marginTop: 9`, `marginLeft: -5`. None match the scale; they
  were eyeballed. `marginLeft: -5` on an `Icon` inside `ReviewItem` is the worst
  — a parent nudging a shared component. Fix it in `ReviewItem.module.css`.
- **Extract duplicated style objects.** The centred-panel `style={{ flex: 1,
display: 'flex', … }}` appears identically in `RunShell/index.jsx:74` and
  `RunOutputEmpty.jsx:26`.
- **No CSS-in-JS.** No styled-components, no Emotion.
- **Class names describe role, not appearance.**
- Support dark mode by redefining tokens, never by re-specifying components.
- Respect `prefers-reduced-motion`.

---

## 7. UI widgets — Radix

**Rule:** hand-build the simple primitives, use **headless** libraries for
anything with focus management, layering, or keyboard navigation. **No component
library** (antd, MUI, Chakra, Mantine) and **no shadcn**.

**Today:** no UI library at all — the 10 primitives in `components/ui/` are
hand-built and good. But there are **zero overlay widgets**, and four
`chevronDown` affordances already render for menus that don't open:
`Sidebar:77`, `Sources:121`, `NewRun:170`, `WorkspaceRegistry:95`.

That makes this the right moment to decide, before the hard parts get built.

### What we hand-build

Simple, mostly presentational, small a11y surface: Button, Chip, Checkbox,
Toggle, ProgressBar, SearchInput, SegmentedControl, Surfaces, DataTable, Icon.

### What we never hand-build

| Widget            | Package                         |
| ----------------- | ------------------------------- |
| Modal / confirm   | `@radix-ui/react-dialog`        |
| Dropdown menu     | `@radix-ui/react-dropdown-menu` |
| Select / combobox | `@radix-ui/react-select`        |
| Popover           | `@radix-ui/react-popover`       |
| Tooltip           | `@radix-ui/react-tooltip`       |
| Tabs              | `@radix-ui/react-tabs`          |
| Accordion         | `@radix-ui/react-accordion`     |

These carry focus trapping and restoration, Escape handling, scroll locking,
roving tabindex, typeahead, and collision-aware positioning. Each is easy to get
80% right by hand and genuinely hard to get correct — and the missing 20% is
exactly what keyboard and screen-reader users depend on.

### How to add one

1. **Install only that package.** One widget, one dependency.
2. **Wrap it in `components/ui/<Widget>/`** so the app imports our component, not
   Radix directly. Swapping it later is then a one-file change.
3. **Style the parts in a sibling `.module.css`** with existing tokens. Radix
   ships no CSS, so nothing needs overriding.
4. **Use `asChild`** to compose with our existing primitives.

```jsx
import * as Dialog from '@radix-ui/react-dialog';
import Button from '@/components/ui/Button';
import styles from './PublishDialog.module.css';

<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button variant="primary">Publish</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className={styles.overlay} />
    <Dialog.Content className={styles.content}>
      <Dialog.Title className={styles.title}>Publish ontology?</Dialog.Title>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>;
```

**Start with the workspace switcher** in `Sidebar:77` — build it on
`@radix-ui/react-dropdown-menu` as the reference implementation, then the other
three follow the same pattern.

### Why not shadcn/ui

shadcn is not a library you install — it is Radix + Tailwind + `cva`, pasted into
your repo. The Radix half is what we want; the Tailwind half brings the second
styling system rejected in §6. Take the primitives directly.

If a design needs something Radix doesn't cover, check **React Aria** before
hand-rolling. No icon package — icons are inline SVG in `Icon.jsx`.

---

## 8. Accessibility

- **Every `<button>` needs an explicit `type`.** The default is `submit`, which
  silently submits any enclosing form. Every button in the repo already sets
  one — keep it that way.
- **Fix `SegmentedControl`.** It sets `role="tablist"` / `role="tab"` /
  `aria-selected` but implements no arrow-key navigation and no `aria-controls`.
  A screen reader announces "tab 1 of 3", the user presses an arrow, nothing
  happens — incomplete ARIA is worse than none.
  **Decide by usage, checking each call site:** used as filter pills (Sources,
  ReviewQueue) → `role="group"` + `aria-pressed`. Used as real tab navigation →
  complete the pattern, or replace with `@radix-ui/react-tabs`. If both usages
  exist, split into two components rather than adding a `mode` prop.
  _(`Toggle` does the equivalent job correctly with `role="switch"` +
  `aria-checked` — this is an inconsistency, not a knowledge gap.)_
- Interactive means `<button>` or `<a>`. Never a `<div onClick>`. _(Clean today.)_
- Every input has a `<label>`, or `aria-label` where the design has no visible
  text. Icon-only controls need an accessible name; decorative icons need
  `aria-hidden="true"`.
- Visible focus on everything focusable. Never `outline: none` without a
  `:focus-visible` replacement.
- Dynamic status goes in an `aria-live` region. Modals trap focus, close on
  Escape, restore focus to the trigger — Radix handles this.
- Text contrast ≥ 4.5:1.
- **Run `eslint-plugin-jsx-a11y`** — it catches most of the above automatically.

---

## 9. Tooling

Missing entirely today. All of it is one afternoon, and it stops the drift.

- **Path aliases** — `vite.config.js` + `jsconfig.json` (§2).
- **Prettier** + `.editorconfig`. Formatting is inconsistent right now
  (`main.jsx` has no semicolons, everything else does). Add
  `"format": "prettier --write ."` and run it once.
- **ESLint additions:** `eslint-plugin-jsx-a11y`, `eslint-plugin-import`
  (`import/order`). After the feature migration, add
  `import/no-restricted-paths` so a feature importing another feature's
  internals is a lint error.
- **`prop-types`** (§4).
- **Husky + lint-staged** — lint and format on commit.
- **CI** running `lint` and `build` on every PR.
- **`.env.example`** documenting `VITE_API_BASE`.
- **Rewrite the README.** It is still the Vite template and describes a starter,
  not this app.

---

## 10. Anti-patterns — reject these in review

- `useEffect` that computes a value from props or state
- `useState` holding something derivable
- A component importing a fixture or mock
- A colour, font size, or spacing literal in a component
- `style={{ marginTop: 7 }}` — static, off-scale, inside a component
- A `<div>` with `onClick`
- `'running'` compared as a literal instead of `RUN_STATUS.running`
- A shared component growing a boolean prop per caller
- A `utils.js` that has become 400 lines of unrelated functions
- `../../../` imports
- `index.jsx` as an actual component filename
- A hand-rolled modal, dropdown, or tooltip
- `catch {}` with no handling
- Array index as `key` in a reorderable list
- Commented-out code on a branch

---

## The plan

Ordered so mechanical, reversible work happens first. **There are no tests here**,
so this ordering _is_ the safety net — do not reorder, and commit between steps.

| #   | Step                                                                             | Covers |
| --- | -------------------------------------------------------------------------------- | ------ |
| 1   | Path aliases, Prettier, ESLint a11y + import order, `.env.example`               | §2, §9 |
| 2   | Rename `index.jsx` files, fold in the 3 flat components, rename the 2 hooks      | §4     |
| 3   | PropTypes on all shared components                                               | §4     |
| 4   | Tokenise graph colours, centralise remaining constants, kill literal comparisons | §3, §6 |
| 5   | Button types, SegmentedControl semantics, jsx-a11y warnings                      | §8     |
| 6   | Static inline styles → CSS modules; extract the duplicated panel style           | §6     |
| 7   | ErrorBoundary, route-level lazy loading, first Radix dropdown                    | §5, §7 |
| 8   | Feature folders — one feature at a time, smallest first                          | §1     |
| 9   | Split the five oversized components                                              | §4     |

**Order for step 8:** `sources` → `ontology` → `graph` → `workspaces` → `runs` →
`review`. Smallest first, so the pattern is proven before the hard ones.

### Do not, in any step

- Change visual output or behaviour. If a refactor changes what renders, it is
  wrong.
- Rename props on existing components unless the step says so.
- Migrate to TypeScript, add Tailwind, or add a component library.
- Delete `src/mocks/` — it moves in step 8, it does not disappear.
- Reformat files you are not otherwise editing (step 1 handles this once).

### Verify after every step

```
npm run lint     # zero errors
npm run build    # succeeds
npm run dev      # then walk the routes
```

**Route walk** — each must render and be interactive, with a clean console (no
`key`, `aria`, or PropTypes warnings):

`/workspaces` · `/w/ws-1/overview` · `/sources` · `/runs` · `/runs/new` ·
`/runs/:id` · `/runs/:id/review/concepts` · `/runs/:id/review/questions` ·
`/runs/:id/ontology` · `/runs/:id/graph` · `/review`

If something breaks and the cause isn't obvious in five minutes, `git reset
--hard` and redo the step in smaller pieces. The steps are sized to make that
cheap.

---

## Deferred

Decisions, not oversights:

- **Tests.** Out of scope for now. When you return to them, the highest-value
  first targets are `useSelection`, `useDecisionState`, and `utils/format.js` —
  all pure, all heavily branched. Note that until they exist, the route walk
  above is the only regression check you have.
- **TypeScript.** A separate project. PropTypes (§4) closes the immediate gap.
- **Wiring the data layer.** `lib/api.js` stays unused until there is a backend.
  Step 8 puts each feature's mocks inside that feature specifically so the
  eventual swap is contained to one folder each.

---

## Final checklist

- [ ] `npm run lint` clean, `jsx-a11y` at `error`
- [ ] `npm run build` succeeds
- [ ] Every route renders; console clean
- [ ] No `../../` imports; no file named `index.jsx`
- [ ] Every shared component has PropTypes
- [ ] No hardcoded hex outside `tokens.css`; no static values in `style={{}}`
- [ ] No string literal compared where a constant exists
- [ ] Every `<button>` has a `type`
- [ ] No feature imports another feature's internals
- [ ] Keyboard-only pass over `/sources` and `/review/concepts` works
