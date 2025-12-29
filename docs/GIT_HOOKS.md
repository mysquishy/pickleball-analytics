# Git Hooks Configuration

## Overview

This project uses **Husky** and **lint-staged** to run code quality checks automatically before commits, ensuring code quality standards are maintained.

## Setup

### Tools Installed

- **Husky**: Git hooks manager for Node.js
- **lint-staged**: Run linters on staged files only

### Pre-commit Hook

Location: `.husky/pre-commit`

```bash
npx lint-staged
```

## What Runs on Commit

When you run `git commit`, the following checks run **only on staged files**:

### For TypeScript/JavaScript files (`*.{js,jsx,ts,tsx}`):

1. **ESLint** - `eslint --fix`
   - Auto-fixes linting issues
   - Checks for code quality problems
   - Reports errors that block commit

2. **Prettier** - `prettier --write`
   - Auto-formats code to project standards
   - Ensures consistent formatting

### For other files (`*.{json,css,scss,md}`):

1. **Prettier** - `prettier --write`
   - Formats JSON, CSS, SCSS, and Markdown files

## Configuration

### lint-staged config in `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,css,scss,md}": [
    "prettier --write"
  ]
}
```

## How It Works

1. You stage files: `git add .`
2. You commit: `git commit -m "my changes"`
3. Husky triggers the pre-commit hook
4. lint-staged runs ESLint and Prettier on staged files
5. Auto-fixable issues are fixed automatically
6. Files are re-staged with fixes
7. Commit proceeds if no errors remain
8. Commit is blocked if errors cannot be auto-fixed

## Bypassing Hooks (Not Recommended)

If you absolutely must bypass the hooks:

```bash
git commit --no-verify -m "message"
```

**Warning**: Only use this in exceptional cases (e.g., urgent hotfixes, WIP commits).

## Benefits

- ✅ **Enforces Code Quality**: Catches issues before they reach the repository
- ✅ **Fast**: Only checks staged files, not the entire codebase
- ✅ **Auto-fixes**: Automatically fixes formatting and simple linting issues
- ✅ **Consistent Style**: All code follows the same formatting rules
- ✅ **Team Alignment**: All developers use the same quality checks

## Testing Hooks

Test the pre-commit hook without committing:

```bash
# Stage some files
git add .

# Run lint-staged manually
npx lint-staged
```

## Troubleshooting

### Hook Not Running

**Problem**: Commit succeeds even with bad code

**Solutions**:

1. Ensure `.husky/pre-commit` is executable: `chmod +x .husky/pre-commit`
2. Verify husky is installed: `npm list husky`
3. Check git hooks enabled: `ls -la .git/hooks/`

### Lint-staged Not Finding Files

**Problem**: "lint-staged could not find any staged files"

**Solution**: Files must be staged with `git add` before committing

### Auto-fix Not Working

**Problem**: ESLint/Prettier not fixing issues automatically

**Solution**: Check that commands use `--fix` or `--write` flags in lint-staged config

### Commit Blocked by Errors

**Problem**: Commit blocked by ESLint errors

**Solutions**:

1. Run `npm run lint -- --fix` on affected files
2. Fix errors manually
3. Only use `--no-verify` if absolutely necessary

## CI/CD Integration

The pre-commit hooks complement CI/CD checks:

- **Pre-commit**: Fast feedback, catches issues early
- **CI/CD**: Final gate, runs full `npm run check`

Recommended CI/CD workflow:

```yaml
- name: Run quality checks
  run: npm run check
```

This runs ESLint, TypeScript, Prettier, and build on all files.

## Related Documentation

- [ESLint Configuration](.eslintrc/README.md)
- [Prettier Configuration](.prettier/README.md)
- [TypeScript Configuration](TYPESCRIPT_ISSUES.md)
- [Available Scripts](package.json scripts section)

## Best Practices

1. **Don't bypass hooks**: Fix issues instead of using `--no-verify`
2. **Stage intentionally**: Only stage files you want to commit
3. **Review auto-fixes**: Check what lint-staged changed
4. **Keep hooks fast**: They run on every commit
5. **Update with team**: Commit `.husky/` and `package.json` changes

## Customizing Hooks

### Add Another Hook

```bash
npx husky add .husky/pre-push "npm test"
```

### Modify Commands

Edit `.husky/pre-commit`:

```bash
npx lint-staged && npm run type-check
```

Edit `package.json` lint-staged config to change which files/commands run.

## Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
