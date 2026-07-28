import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.tmp']),
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Import Sorting & Consistency Rules
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-duplicate-imports': 'error',

      // TypeScript Strictness Rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // ES6+ Strict Code Style Rules
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'object-shorthand': ['error', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
    },
  },
]);