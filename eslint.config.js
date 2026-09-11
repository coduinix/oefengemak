import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // The domain layer must stay portable: no framework, no DOM, no ambient randomness.
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['react', 'react-*', 'zustand', 'sonner'], message: 'src/domain must stay framework-free.' },
            { group: ['@/app/*', '@/features/*', '@/components/*', '@/stores/*', '@/i18n/*'], message: 'src/domain may not depend on UI layers.' },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'document', message: 'src/domain must stay DOM-free.' },
        { name: 'window', message: 'src/domain must stay DOM-free.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Use the injected Rng so generation stays deterministic.' },
      ],
      'no-console': 'error',
    },
  },
)
