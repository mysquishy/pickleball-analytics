---
allowed-tools: all
description: Improve code quality without changing behavior
---

# /refactor

## Purpose

Refactors code for better maintainability while preserving exact behavior.

## Arguments

Optional: `ARGUMENTS$` for specific files/patterns

## Execution

### Execution

SPAWN REFACTORING AGENTS IN PARALLEL (single message, multiple Task tools):

- validation: Identify refactoring opportunities
- [language_specialist]: Implement refactoring
- tester: Write tests to verify behavior unchanged
- bugsy: Fix any issues introduced

Select specialist based on detected stack:
Next.js SaaS→typegod + reactlord (TypeScript + React 19)

Targets: Duplicate code, complex functions, naming, coupling, performance, patterns

## Success Criteria

- Behavior identical
- Tests still pass
- Code cleaner/simpler
- Performance same or better
- No new bugs

## Failure Protocol

When refactoring breaks something:

1. Revert changes
2. Add tests first
3. Refactor incrementally
4. Verify each step

## Visual Response

```
♻️ REFACTORING SUMMARY
├─ Files Changed: X
├─ Lines Reduced: -Y
├─ Complexity: Before X → After Y
├─ Tests: ✅ All passing
└─ Behavior: ✅ Unchanged
```

---

_Optimized for: reliability_
