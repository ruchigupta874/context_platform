# Changelog

Notable changes to this project. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — 2026-09-06

A full frontend restructure to [docs/react-guidelines.md](docs/react-guidelines.md),
carried out as nine sequenced steps, one commit each. `npm run lint` and
`npm run build` were verified after every step.

**No behaviour or visual output was intentionally changed.** The one deliberate
exception is spacing: two eyeballed gaps of 7px and 9px were snapped to the 8px
scale (§6). Everything else is a move, a rename, or an internal reorganisation.

> **Not yet verified in a browser.** There are no tests in this repo, so the
> route walk in the guidelines is the only check that catches a panel rendering
> blank or a PropTypes warning in the console. It has not been run. Step 3 added
> prop contracts to every shared component, and any mismatch between a
> declaration and a caller surfaces there and nowhere else.

### Added

- **`prop-types` on every shared component** — all of `components/ui`,
  `components/layout`, and each feature's components. Enum props are typed from
  the constant that defines them (`PropTypes.oneOf(Object.values(TONE))`), so
  renaming a constant surfaces as a console warning rather than silence.
- **Error boundaries** at the app root and around every route element, so a page
  that throws leaves the sidebar and navigation usable. Previously a single
  render error white-screened the whole app.
- **Route-level code splitting** — all 12 pages behind `React.lazy`.
- **Radix** for overlay widgets, starting with `@radix-ui/react-dropdown-menu`
  wrapped as `components/ui/DropdownMenu`. The sidebar workspace switcher was a
  chevron that did nothing; it now opens that menu and switches workspace. This
  is the reference implementation for the three remaining chevron placeholders.
- **Feature barrels** (`src/features/*/index.js`), enforced by
  `no-restricted-imports`: a feature may reach into its own internals, never
  another's.
- **Path aliases** — `@` → `src`, in `vite.config.js` and `jsconfig.json`.
- **Tooling** — Prettier, `.editorconfig`, `eslint-plugin-jsx-a11y`,
  `eslint-plugin-import-x`, and `npm run format` / `format:check`.
- **`.env.example`** documenting `VITE_API_BASE`, which `endpoints.js` reads.
- **Graph colour tokens** (`--graph-edge`, `--graph-node-stroke`, …) in
  `tokens.css`, replacing four hardcoded hexes.
- **`RUN_VIEW`, `SOURCE_KIND` and `SOURCE_TAB` constants**, replacing bare string
  comparisons.
- **`Panel` gains a `center` prop**, replacing an identical flex-centring style
  object duplicated across four files.
- **Documentation** — `docs/react-guidelines.md` (the single frontend reference)
  and `CLAUDE.md`.

### Changed

- **`src/` is organised by feature.** Six features — `workspaces`, `sources`,
  `runs`, `review`, `ontology`, `graph` — each own their pages, components,
  hooks, constants and fixtures. `review` previously spanned six top-level
  folders and `runs` five; both are now one folder each.
  - `app/` holds the wiring: `App`, `router`, `Providers`, `ErrorBoundary`.
    Providers moved out of `AppShell` so the shell stays a layout component.
  - `components/ui` and `components/layout` keep only what is genuinely shared.
    `RunShell` and the pipeline components moved into `features/runs`; the review
    components into `features/review`.
  - `lib/` took `api.js` and `endpoints.js` from `utils/`.
- **236 relative imports rewritten to `@/` aliases.** No `../` imports remain.
- **30 `index.jsx` files renamed after their component**, each with an `index.js`
  barrel beside it, so import paths are unchanged but files are findable.
  `Icon`, `RunOutputEmpty` and `DecisionActions` moved into folders to match.
- **`Icon`'s 147-line path map moved to `Icon/paths.jsx`.** Exporting
  `ICON_NAMES` alongside the component broke fast refresh. `Icon.jsx` is now 35
  lines.
- **Hooks renamed** for clarity: `useDecisions` → `useDecisionState` (local
  state), `useReviewDecisions` → `useReviewContext` (reads the context).
- **Static inline styles moved into CSS modules.** Every remaining `style={{}}`
  is now a runtime-computed value — grid templates, progress widths, the tree's
  computed indent, entity colours from data. Fourteen static colour styles became
  role-named classes.
- **Oversized components split along real seams**, none by line count:

  | File             | Before | After | Extracted                                                        |
  | ---------------- | ------ | ----- | ---------------------------------------------------------------- |
  | `KnowledgeGraph` | 415    | 57    | `useGraphView`, `GraphControls`, `GraphCanvas`, `GraphInspector` |
  | `Overview`       | 390    | 95    | `useOverviewData`, two phase screens, five panels                |
  | `Ontology`       | 329    | 79    | `ClassTree`, `ClassDetail`, `OntologyRail`                       |
  | `NewRun`         | 284    | 209   | `useNewRunForm`, `RunSummaryRail`                                |
  | `ReviewConcepts` | 266    | 196   | `ConceptDetail`                                                  |

  No file in `src/` now exceeds 250 lines.

### Fixed

- **`SegmentedControl` announced itself as tabs but did not behave as tabs.** It
  set `role="tablist"` / `role="tab"` / `aria-selected` with no arrow-key
  navigation and no `aria-controls`, so a screen reader announced "tab 1 of 3"
  for a control the arrow keys did not drive. All four uses filter a list in
  place, so it is now `role="group"` with `aria-pressed` toggle buttons. The
  Sources tab strip had hand-rolled the same mistake and got the same fix.
- **The ontology tree could not be expanded from the keyboard.** The caret was a
  `<span>` with a click handler: mouse users could expand a class, keyboard users
  could not. The row is now a `role="treeitem"` with `aria-expanded` and
  ArrowRight/ArrowLeft inside a `role="tree"`; the caret is a real button hidden
  from assistive tech as a mouse-only affordance.
- **`WorkspaceRegistry` had a dead status filter.** Its `SegmentedControl` was
  commented out, leaving `status` permanently `"all"` and the filter branch
  unreachable. Removed along with three other commented-out JSX blocks and the
  unused imports. Filtering behaviour is unchanged.

### Removed

- **`design/`** — 3 MB of Claude Design `.dc.html` artboards, unreferenced by the
  app or any config.

### Performance

|             | Before             | After                   |
| ----------- | ------------------ | ----------------------- |
| Initial JS  | 386 kB (one chunk) | 331 kB across 14 chunks |
| Initial CSS | 70 kB              | 20 kB                   |

Radix adds ~84 kB, more than offset by the splitting. The graph and ontology
screens no longer ship to someone opening the run list.

### Deferred by decision, not oversight

- **Tests.** Highest-value first targets when they arrive: `useSelection`,
  `useDecisionState`, `utils/format.js` — all pure and heavily branched.
- **TypeScript.** `prop-types` closes the immediate gap; a migration is its own
  project rather than part of a restructure.
- **Wiring the data layer.** `lib/api.js` and `lib/endpoints.js` are well-built
  and still unused; pages read their feature's `mocks.js` directly. Because
  fixtures are synchronous module imports, no page has a loading, error or empty
  state. The feature layout means the eventual swap is contained to one folder
  each.
- **Tailwind — declined.** 28 CSS module files and ~4,900 lines of working CSS
  sit on a mature semantic token layer. Adopting Tailwind would mean either
  rewriting all of it for no functional gain, or running two styling systems and
  two token vocabularies side by side. See §6 of the guidelines.

### Notes for reviewers

Three deviations from the plan as written, each recorded in its commit:

- **Feature barrels export shared API but not pages.** Exporting pages made every
  barrel pull in every other feature's pages and closed an import cycle
  (`workspaces` → `runs` → `workspaces`). The router imports pages by path.
- **`eslint-plugin-import` caps its peer range at ESLint 9**, so ordering uses
  `eslint-plugin-import-x`. Its resolver interface does not accept the alias
  config, so `no-cycle` and `no-unresolved` are off; ordering and duplicate
  detection are lexical and work.
- **Page-local constants skipped the hop to `config/constants`.** They were going
  to move again into their feature, so the intermediate move was churn.

One earlier finding was **wrong and has been retracted**: "15 `<button>` without
`type`" was a false positive from a single-line grep over multi-line JSX. Every
button in the repo, including at the pre-refactor commit, already set `type`.

### Commits

```
1d96848  docs: bring guidelines and CLAUDE.md up to the restructured tree
8844a3c  refactor: split the remaining oversized pages
16270cb  refactor: split KnowledgeGraph and Overview along their real seams
b3e6955  refactor: organise src by feature
6b863db  feat: error boundaries, route code splitting, first Radix widget
cfb7f30  refactor: move static inline styles into CSS modules
27b71cf  fix(a11y): same honest semantics for the Sources tab strip
c13154c  fix(a11y): honest segmented-control semantics, keyboard-driven tree
9694dd1  refactor: tokenise graph colours, replace literal enum comparisons
8ea73e9  feat: prop-types on every shared component
ebcd7ef  refactor: name component files after their component; clarify hooks
9dc050d  chore: path aliases, prettier, eslint a11y + import ordering
2f12a1d  chore: remove design artboards and dead code
4f40e21  docs: add react-guidelines as the single frontend reference
```
