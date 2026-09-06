# context_platform

React 19 + Vite + React Router 7. JavaScript (no TypeScript). CSS Modules.
The app currently runs entirely on fixtures in `src/mocks/` — there is no backend.

**No component library and no Tailwind.** The UI primitives in
`src/components/ui/` are hand-built and styled with CSS Modules against
`src/styles/tokens.css`. Icons are inline SVG in `Icon.jsx`. Do not add antd, MUI,
Chakra, Mantine, Tailwind, shadcn, CSS-in-JS, or an icon package. Overlay widgets
(modal, dropdown, select, popover, tooltip, tabs) use **Radix**, one package at a
time.

## Commands

```
npm run dev      # vite dev server
npm run build    # production build
npm run lint     # eslint
```

## Conventions

**[docs/react-guidelines.md](docs/react-guidelines.md) is the single reference for
this codebase.** Read it before writing components. It covers folder structure,
imports, constants, components, state and data, styling, Radix, accessibility and
tooling — each section stating the rule, what the repo does today, and what to
change.

**If asked to restructure or refactor:** follow "The plan" at the bottom of that
file. One step at a time, verifying and committing between steps. Do not attempt
multiple steps at once, and do not start a step before the previous one is
committed. There are no tests in this repo, so the step ordering and the route
walk are the only safety net.

### The rules that come up most here

- Constants live in `src/config/constants/`, split by domain. Never compare a
  status against a string literal — use the constant (`RUN_STATUS.failed`).
- Colours, spacing and type come from `src/styles/tokens.css`. No raw hex in a
  component.
- Inline `style={{}}` only for runtime-computed values (grid templates, progress
  widths, computed indents). Static spacing belongs in the CSS module.
- Each component owns a folder with its `.module.css` beside it.
- Context ships as a provider file plus a hook that throws when used outside it.
  Never export the raw context.
- Keep components under ~150 lines. Extract a hook before extracting a component.

### Known gaps — do not add to them

- No prop contracts anywhere. New shared components get `prop-types` at minimum.
- `src/utils/api.js` and `src/utils/endpoints.js` are the intended data layer but
  are currently unused; pages import from `src/mocks/` directly. Do not add new
  direct mock imports to pages — go through a hook.
- No error boundary, no path aliases, no code splitting yet.
