# TypeScript Configuration

## Overview

TypeScript is configured with strict mode enabled for maximum type safety. The `type-check` script validates all TypeScript code without emitting JavaScript files.

## Configuration

### `tsconfig.json`

**Strict Type Checking:**

```json
{
  "strict": true, // Enables all strict type checking options
  "noImplicitReturns": true, // Catch missing return statements
  "noFallthroughCasesInSwitch": true, // Prevent switch bugs
  "noImplicitOverride": true, // Require override keyword
  "allowUnusedLabels": false, // Catch unused labels
  "allowUnreachableCode": false // Catch dead code
}
```

### What Strict Mode Enables

| Option                         | What It Catches                      |
| ------------------------------ | ------------------------------------ |
| `noImplicitAny`                | Disallows implicit `any` types       |
| `strictNullChecks`             | Checks for null/undefined            |
| `strictFunctionTypes`          | Stricter function type checking      |
| `strictBindCallApply`          | Stricter bind/call/apply             |
| `strictPropertyInitialization` | Class properties must be initialized |
| `alwaysStrict`                 | Parse in strict mode                 |

## Scripts

### `npm run type-check`

Run TypeScript compiler in check mode:

```bash
npm run type-check
```

This checks for type errors without generating JavaScript files.

## Known TypeScript Issues

### 1. NextAuth Adapter Type Incompatibility

**File:** `auth.ts:10`
**Error:** Type mismatch between `@auth/core` and `next-auth` adapters
**Status:** Known issue with NextAuth v5 beta
**Impact:** None - runtime works correctly
**Fix:** Waiting for NextAuth v5 stable release

### 2. Stripe API Version Mismatch

**File:** `lib/stripe.ts:4`
**Error:** API version type mismatch
**Status:** Stripe SDK version-specific
**Impact:** None - SDK handles versioning
**Fix:** Will resolve with next Stripe SDK update

## Using Type Check in CI/CD

Add to your pipeline:

```yaml
- name: Type check
  run: npm run type-check
```

## IDE Integration

### VSCode

TypeScript errors are shown inline. Configure in `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### JetBrains IDEs

Settings → Languages → TypeScript

- Enable "TypeScript language service"
- Set "TypeScript version" to use project version

## Type Checking Workflow

### Development

1. Write TypeScript code
2. IDE shows type errors inline
3. Run `npm run type-check` before committing

### Pre-commit

Optional: Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run type-check
```

### Continuous Integration

Always run in CI/CD to catch type errors before deployment.

## Best Practices

1. **Fix Type Errors**: Don't use `@ts-ignore` without documented reason
2. **Prefer Interfaces**: Use interfaces for object shapes
3. **Use Type Guards**: Validate data at runtime
4. **Avoid `any`**: Use specific types or `unknown`
5. **Enable Strict**: Always use strict mode in production

## Common Type Patterns

### API Response Types

```typescript
interface User {
  id: string;
  email: string;
  name: string | null;
}
```

### Environment Variables

```typescript
const envVar = process.env.VAR_NAME;
if (!envVar) throw new Error('VAR_NAME required');
// TypeScript now knows envVar is string
```

### Optional Properties

```typescript
interface Config {
  required: string;
  optional?: string; // Can be undefined
}
```

## Troubleshooting

### Issue: Type check errors in node_modules

**Solution**: Already handled by `skipLibCheck: true`

### Issue: "Cannot find module"

**Solution**: Run `npm install` or check `tsconfig.json` paths

### Issue: False positive type errors

**Solution**: Ensure `@types/*` packages are installed

## Type Safety Levels

| Level       | strict | noUnusedLocals | noUncheckedIndexedAccess |
| ----------- | ------ | -------------- | ------------------------ |
| **Current** | ✅     | ⬜ (ESLint)    | ⬜ (too strict)          |
| Recommended | ✅     | ⬜             | ⬜                       |
| Very Strict | ✅     | ✅             | ✅                       |

Our configuration balances safety with practicality:

- ✅ Strict mode enabled
- ✅ ESLint handles unused variables
- ⬜ Indexed access checks disabled (too noisy for arrays)

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Next.js TypeScript](https://nextjs.org/docs/basic-features/typescript)
- [Strict Mode Explanation](https://www.typescriptlang.org/tsconfig#strict)
