import antfu from '@antfu/eslint-config';

export default antfu({
  // --- Global Configuration ---
  type: 'app',
  typescript: true,
  vue: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single',
  },
  ignores: [
    '**/migrations/*',
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/*.md',
    '**/.github/**/*.md',
    '**/drizzle/**',
    '**/drizzle/**/*.json',
    '**/drizzle/**/*.sql',
  ],
},
// --- Shared Rules ---
{
  rules: {
    'antfu/no-top-level-await': 'off',
    'perfectionist/sort-imports': ['error', {}],
  },
},
// --- Backend Specifics ---
{
  files: ['backend/**/*.ts'],
  rules: {
    'no-console': 'warn',
    'node/prefer-global/process': 'off',
    'node/no-process-env': 'error',
  },
},
// --- Frontend Specifics ---
{
  files: ['frontend/**/*.{vue,ts,tsx}'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': 'off',
  },
});
