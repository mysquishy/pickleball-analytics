# ESLint Configuration

## Overview

ESLint is configured with TypeScript, React, Next.js, and Prettier integration to catch real problems without being overly strict.

## Configuration

### Base Configs

- **`next/core-web-vitals`** - Next.js recommended rules
- **`next/typescript`** - TypeScript-specific rules for Next.js
- **`prettier`** - Disables formatting rules (handled by Prettier)

### Rule Categories

#### TypeScript Rules

| Rule                             | Level | Purpose                                     |
| -------------------------------- | ----- | ------------------------------------------- |
| `no-unused-vars`                 | Error | Catch unused variables (allows `_` prefix)  |
| `no-explicit-any`                | Off   | Allow `any` for flexibility                 |
| `explicit-function-return-type`  | Off   | Infer return types automatically            |
| `explicit-module-boundary-types` | Off   | Infer component types automatically         |
| `no-non-null-assertion`          | Off   | Allow `!` operator (necessary for env vars) |

#### React Rules

| Rule                          | Level | Purpose                         |
| ----------------------------- | ----- | ------------------------------- |
| `prop-types`                  | Off   | Using TypeScript instead        |
| `react-in-jsx-scope`          | Off   | Not needed in Next.js           |
| `react-hooks/rules-of-hooks`  | Error | Enforce Hooks rules             |
| `react-hooks/exhaustive-deps` | Warn  | Warn about missing dependencies |

#### Next.js Rules

| Rule                     | Level | Purpose                         |
| ------------------------ | ----- | ------------------------------- |
| `no-html-link-for-pages` | Error | Prevent incorrect link usage    |
| `no-img-element`         | Warn  | Suggest Next.js Image component |

#### Best Practices

| Rule                    | Level                    | Purpose                          |
| ----------------------- | ------------------------ | -------------------------------- |
| `no-console`            | Warn (dev) / Warn (prod) | Console methods allowed in dev   |
| `no-debugger`           | Off (dev) / Error (prod) | Prevent debug statements in prod |
| `no-alert`              | Warn                     | Prefer UI notifications          |
| `no-var`                | Error                    | Enforce `const`/`let`            |
| `prefer-const`          | Error                    | Use `const` when possible        |
| `no-duplicate-imports`  | Error                    | Prevent duplicate imports        |
| `no-unused-expressions` | Error                    | Catch useless expressions        |
| `object-shorthand`      | Error                    | Use shorthand properties         |
| `prefer-template`       | Warn                     | Suggest template literals        |

#### Security

| Rule              | Level | Purpose                      |
| ----------------- | ----- | ---------------------------- |
| `no-eval`         | Error | Prevent `eval()` usage       |
| `no-implied-eval` | Error | Prevent indirect `eval`      |
| `no-new-func`     | Error | Prevent Function constructor |

#### Error Handling

| Rule                           | Level | Purpose                          |
| ------------------------------ | ----- | -------------------------------- |
| `no-throw-literal`             | Error | Throw Error objects, not strings |
| `prefer-promise-reject-errors` | Error | Reject with Error objects        |

#### Performance

| Rule           | Level | Purpose                       |
| -------------- | ----- | ----------------------------- |
| `no-loop-func` | Warn  | Warn about functions in loops |
| `jsx-key`      | Error | Require `key` props in lists  |

#### Accessibility (a11y)

| Rule                           | Level | Purpose                    |
| ------------------------------ | ----- | -------------------------- |
| `jsx-a11y/alt-text`            | Warn  | Missing alt text on images |
| `jsx-a11y/anchor-is-valid`     | Warn  | Invalid anchor tags        |
| `click-events-have-key-events` | Warn  | Keyboard accessibility     |

## Scripts

### `npm run lint`

Run ESLint on all files:

```bash
npm run lint
```

### Auto-fix Issues

```bash
npm run lint -- --fix
```

## Ignored Files

ESLint ignores:

- `.next/**` - Next.js build output
- `node_modules/**` - Dependencies
- `out/**`, `build/**`, `dist/**` - Build outputs
- `*.config.js`, `*.config.mjs` - Config files
- `next-env.d.ts` - Next.js generated types

## Integration with Prettier

**Key Principle**: ESLint handles code **quality**, Prettier handles **formatting**.

### How They Work Together

1. **Prettier** formats your code (spacing, quotes, semicolons)
2. **ESLint** checks for issues (unused vars, React rules, security)
3. **`eslint-config-prettier`** disables conflicting ESLint rules

### No Conflicts

The `prettier` config is placed **last** in the extends array to disable any ESLint rules that conflict with Prettier's formatting.

## Common Issues & Solutions

### Issue: "React is not defined"

**Solution**: Already fixed - `react/react-in-jsx-scope` is off for Next.js

### Issue: "Too many unused vars warnings"

**Solution**: Prefix with underscore: `const _unused = ...`

### Issue: "Prefer const/let"

**Solution**: Use `const` by default, `let` when reassigning

### Issue: "Missing alt text"

**Solution**: Add descriptive alt to images: `<Image alt="Description" />`

### Issue: "Duplicate imports"

**Solution**: Combine imports: `import { useState, useEffect } from 'react'`

## Customizing Rules

Edit `eslint.config.mjs` to adjust rules:

```javascript
{
  rules: {
    'no-console': 'off', // Always allow console
    'prefer-const': 'warn', // Warn instead of error
  }
}
```

## TypeScript Support

TypeScript rules are fully enabled via `next/typescript`:

- Type checking (handled by TypeScript compiler)
- Unused variables
- Type-specific best practices
- Next.js + TypeScript integration

## React Support

React and Next.js rules via `next/core-web-vitals`:

- Hooks rules
- JSX best practices
- Next.js specific patterns
- Performance optimizations

## IDE Integration

### VSCode

Install ESLint extension:

```bash
code --install-extension dbaeumer.vscode-eslint
```

Add to `.vscode/settings.json`:

```json
{
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.run": "onType"
}
```

### JetBrains IDEs

Settings → Languages → JavaScript → Code Quality Tools → ESLint

- Enable "Run eslint --fix on save"
- Select "Automatic" for ESLint package

## Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run lint -- --fix
```

## CI/CD Integration

Add to your pipeline:

```yaml
- name: Lint code
  run: npm run lint
```

## Best Practices

1. **Run before committing**: `npm run lint -- --fix`
2. **Fix auto-fixable issues**: Use `--fix` flag
3. **Don't ignore warnings**: They often indicate real issues
4. **Keep rules updated**: Review when upgrading Next.js
5. **Team alignment**: Commit `eslint.config.mjs` for consistency

## Troubleshooting

### Issue: ESLint not working in IDE

**Solution**: Restart IDE, ensure dependencies installed

### Issue: False positives

**Solution**: Use `// eslint-disable-next-line` sparingly

### Issue: Too many errors

**Solution**: Run with `--fix` to auto-fix most issues

### Issue: Conflicts with Prettier

**Solution**: Ensure `prettier` is last in extends array

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Next.js ESLint Config](https://nextjs.org/docs/basic-features/eslint)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
