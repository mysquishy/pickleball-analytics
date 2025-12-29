import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base configs with Prettier integration
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
  }),
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      '.cache/**',
      'public/**',
      'bin/**',
      '*.config.js',
      '*.config.mjs',
      'next-env.d.ts',
    ],
  },
  // Custom rules for TypeScript, React, and Next.js
  {
    rules: {
      // TypeScript Rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for flexibility
      '@typescript-eslint/explicit-function-return-type': 'off', // Infer return types
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Infer component types
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow ! operator (necessary for env vars)

      // React Rules
      'react/prop-types': 'off', // Using TypeScript for props validation
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react-hooks/rules-of-hooks': 'error', // Enforce React Hooks rules
      'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies

      // Next.js Rules
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',

      // General Best Practices
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-alert': 'warn', // Prefer UI notifications over alert()
      'no-var': 'error', // Enforce const/let
      'prefer-const': 'error', // Use const when possible
      'no-duplicate-imports': 'error', // Prevent duplicate imports

      // Code Quality (caught by Prettier, but good to have)
      'no-unused-expressions': 'error', // Catch useless expressions
      'no-constant-condition': 'warn', // Warn about if (true)

      // Security
      'no-eval': 'error', // Prevent eval usage
      'no-implied-eval': 'error', // Prevent indirect eval
      'no-new-func': 'error', // Prevent Function constructor

      // Async/Await
      'no-await-in-loop': 'off', // Allow await in loops (common pattern)
      'require-await': 'off', // Allow async functions for future compatibility
      'no-promise-executor-return': 'error', // Prevent returning in promise executor

      // Error Handling
      'no-throw-literal': 'error', // Throw Error objects, not literals
      'prefer-promise-reject-errors': 'error', // Reject with Error objects

      // Styling (some overlap with Prettier, but these are functional)
      'object-shorthand': ['error', 'always'], // Use shorthand properties
      'prefer-destructuring': 'off', // Don't force destructuring (can be less readable)
      'prefer-template': 'warn', // Suggest template literals (but not error)

      // Performance
      'no-loop-func': 'warn', // Warn about function definitions in loops
      'react/jsx-key': 'error', // Require key props in lists

      // Accessibility (a11y)
      'jsx-a11y/alt-text': 'warn', // Warn about missing alt text
      'jsx-a11y/anchor-is-valid': 'warn', // Warn about invalid anchors
      'jsx-a11y/click-events-have-key-events': 'warn', // Keyboard accessibility
    },
  },
];

export default eslintConfig;
