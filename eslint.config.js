import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import { defineConfig, globalIgnores } from 'eslint/config';

const FEATURES = ['workspaces', 'sources', 'runs', 'review', 'ontology', 'graph', 'landing'];

const BARREL_ONLY =
  'Import a feature through its barrel: @/features/<name>. Its internals are private.';

/** Blocks everything below `@/features/<name>/`, while leaving the barrel itself allowed. */
const internalsOf = (name) => ({ group: [`@/features/${name}/*`], message: BARREL_ONLY });

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'import-x': importX },
    rules: {
      // Imports read top-down: framework, then app, then the file's own siblings.
      'import-x/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: { order: 'ignore' },
        },
      ],
      // no-cycle / no-unresolved are omitted: they need module resolution, and
      // import-x v4's resolver interface does not take the alias config here.
      // Ordering and duplicate detection are lexical, so they work as-is.
      'import-x/no-duplicates': 'error',

      /**
       * A feature is imported through its barrel or not at all. Reaching past
       * `@/features/<name>` into its pages, components or mocks is what turned
       * the old type-based layout into six folders per change.
       *
       * Everything outside features/ is held to this. The per-feature overrides
       * below relax it for a feature reaching into itself, which is ordinary
       * internal wiring rather than a boundary crossing.
       */
      'no-restricted-imports': ['error', { patterns: FEATURES.map(internalsOf) }],
    },
  },

  // A feature may reach into its own internals, but not into another's.
  ...FEATURES.map((name) => ({
    files: [`src/features/${name}/**/*.{js,jsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: FEATURES.filter((other) => other !== name).map(internalsOf) },
      ],
    },
  })),
]);
