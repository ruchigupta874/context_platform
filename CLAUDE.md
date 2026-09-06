# context_platform

React 19 + Vite + React Router 7. JavaScript with `prop-types` (no TypeScript).
CSS Modules. The app runs entirely on fixtures — each feature owns its own
`mocks.js`; there is no backend.

**No component library and no Tailwind.** The primitives in `src/components/ui/`
are hand-built and styled with CSS Modules against `src/styles/tokens.css`.
Icons are inline SVG in `Icon/paths.jsx`. Do not add antd, MUI, Chakra, Mantine,
Tailwind, shadcn, CSS-in-JS, or an icon package. Overlay widgets (modal,
dropdown, select, popover, tooltip, tabs) use **Radix**, one package at a time,
wrapped in `components/ui/` — `DropdownMenu` is the reference implementation.

## Commands

```
npm run dev       # vite dev server
npm run build     # production build
npm run lint      # eslint
npm run format    # prettier --write .
```

## Layout

```
src/app/          App, router, Providers, ErrorBoundary  (wiring only)
src/features/     workspaces · sources · runs · review · ontology · graph
src/components/   ui/ (generic primitives) · layout/ (AppShell, Sidebar, TopBar, PageHeader)
src/lib/          api.js, endpoints.js — written, not yet wired
src/config/       navigation.js, constants/common.js (TONE, DENSITY, DECISION)
src/hooks/        useSelection (the only genuinely cross-feature hook)
src/routes/       paths.js
src/styles/       tokens.css, base.css
src/utils/        format.js
```

## Conventions

**[docs/react-guidelines.md](docs/react-guidelines.md) is the single reference.**
Read it before writing components; §11 is the review checklist. The restructure
it describes is complete, so treat it as the standard to hold rather than a
to-do list.

### The rules that come up most

- **Import a feature through its barrel** — `@/features/runs`, never
  `@/features/runs/mocks`. ESLint enforces this; a feature may reach into its own
  internals but never another's. Barrels export shared API, not pages: the router
  imports pages by path, because exporting them closes an import cycle.
- **Constants** live in each feature's `constants.js`; only genuinely
  cross-cutting ones (`TONE`, `DECISION`, `DENSITY`) sit in `config/constants/`.
  Never compare a status against a string literal — use the constant.
- **Colours, spacing and type come from `tokens.css`.** No raw hex in a component.
- **Inline `style={{}}` only for runtime-computed values** — grid templates,
  progress widths, the ontology tree's computed indent. Static spacing belongs in
  the CSS module.
- **Every component file is named after its component**, with an `index.js`
  barrel beside it. No file called `index.jsx`.
- **Every shared component has `propTypes`**, with enum props typed from the
  constant that defines them (`PropTypes.oneOf(Object.values(TONE))`).
- **Keep components under 150 lines**, hard stop 250. Extract a hook before
  extracting a component.
- **Context ships as a provider plus a hook that throws** outside it. Never
  export the raw context. Providers are composed in `app/Providers.jsx`.

### Deliberately still open

- **No tests.** When they arrive, start with `useSelection`, `useDecisionState`
  and `utils/format.js` — all pure and heavily branched.
- **No TypeScript.** `prop-types` covers the immediate gap.
- **The data layer is unwired.** `lib/api.js` and `lib/endpoints.js` are built
  but unused; pages read their feature's `mocks.js` directly. When the API
  lands, add `features/<name>/api/` fetchers and a `useX()` hook returning
  `{ data, isLoading, error }`, and drop the direct mock imports. Do not add new
  direct mock imports to a page in the meantime.
