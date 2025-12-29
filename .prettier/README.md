# Prettier Configuration

## Overview

Prettier is configured with sensible defaults for this Next.js SaaS project. It integrates seamlessly with ESLint to handle code formatting while ESLint handles code quality.

## Configuration Files

### `.prettierrc`

Main Prettier configuration with opinionated defaults:

- **Print Width**: 100 characters
- **Tab Width**: 2 spaces
- **Quotes**: Single quotes (except JSX)
- **Semicolons**: Required
- **Trailing Commas**: ES5 (compatible with older browsers)
- **Arrow Parens**: Always
- **End of Line**: LF (Unix-style)

### `.prettierignore`

Files and directories excluded from formatting:

- Dependencies (`node_modules`)
- Build outputs (`.next`, `dist`, `build`)
- Database files (`*.db`)
- Environment files (`.env`, `!.env.example`)
- Cache and generated files

### ESLint Integration

Modified `eslint.config.mjs` to:

- Use `eslint-config-prettier` (disables conflicting ESLint rules)
- Add `prettier` to extends array
- Keep only code quality rules in ESLint

## Available Scripts

### `npm run format`

Format all files automatically:

```bash
npm run format
```

Formats: JS, JSX, TS, TSX, JSON, CSS, SCSS, MD files

### `npm run format:check`

Check if files are formatted without making changes:

```bash
npm run format:check
```

Useful in CI/CD pipelines. Exits with error if formatting is needed.

## Workflow

### Development

1. Write code normally
2. Run `npm run format` before committing
3. ESLint will catch code quality issues
4. Prettier will handle formatting

### Pre-commit Hook (Optional)

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run format:check
```

### CI/CD Pipeline

Add format check to your pipeline:

```yaml
- name: Check formatting
  run: npm run format:check
```

## ESLint + Prettier Separation

| Tool         | Responsibility                                |
| ------------ | --------------------------------------------- |
| **ESLint**   | Code quality (unused vars, no-alert, etc.)    |
| **Prettier** | Code formatting (spacing, quotes, semicolons) |

### How They Work Together

1. Prettier formats your code
2. ESLint checks for issues (ignoring formatting)
3. No conflicts thanks to `eslint-config-prettier`

## Examples

### Before Prettier

```typescript
const user = { name: 'John', age: 30 }; // bad spacing, double quotes
function foo() {
  return true;
}
```

### After Prettier

```typescript
const user = { name: 'John', age: 30 }; // good spacing, single quotes

function foo() {
  return true;
}
```

## Customizing Rules

Edit `.prettierrc` to change defaults:

```json
{
  "printWidth": 120, // Widen lines
  "singleQuote": false, // Use double quotes
  "trailingComma": "none" // No trailing commas
}
```

## IDE Integration

### VSCode

Install these extensions:

- Prettier - Code formatter
- ESLint

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### JetBrains IDEs

Settings → Languages → JavaScript → Prettier

- Enable "On code reformat"
- Check "Run on save"

## Troubleshooting

### Issue: Files not formatting

**Solution**: Check `.prettierignore` - file might be excluded

### Issue: Conflicts with ESLint

**Solution**: Ensure `eslint-config-prettier` is last in extends array

### Issue: Different formatting in IDE vs CLI

**Solution**: Check IDE Prettier settings match `.prettierrc`

## Best Practices

1. **Format Before Committing**: Always run `npm run format`
2. **CI/CD Check**: Use `format:check` in pipelines
3. **Team Alignment**: Commit `.prettierrc` so team uses same rules
4. **Auto-Format**: Enable format-on-save in IDE
5. **Ignore Generated Files**: Keep `.prettierignore` updated

## Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint + Prettier Guide](https://prettier.io/docs/en/integrating-with-linters.html)
- [Configuration Options](https://prettier.io/docs/en/options.html)
