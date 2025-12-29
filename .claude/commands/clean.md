---
allowed-tools: all
description: Remove dead code and improve codebase maintainability
---

# /clean

## Purpose

Removes unused code, dependencies, and files based on evidence.

## Arguments

Optional: `ARGUMENTS$` for specific areas

## Execution

### Execution

SPAWN CLEANUP AGENTS IN PARALLEL (single message, multiple Task tools):

- validation: Identify unused code/files
- murphy: Find unused dependencies
- [language_specialist]: Remove dead code safely
- tester: Verify nothing broke

Select specialist: Go→gopher, JS→jsmaster, Python→thesnake, TS→typegod

Targets: Unused imports, dead functions, orphaned files, unused deps, commented code

## Success Criteria

- Only unused code removed
- All tests still pass
- Build succeeds
- App functions normally
- Dependencies minimal

## Failure Protocol

When cleanup breaks something:

1. Restore removed code
2. Trace actual usage
3. Clean incrementally
4. Test after each removal

## Visual Response

```
🧹 CLEANUP RESULTS
├─ Files removed: X
├─ Lines deleted: Y
├─ Dependencies removed: Z
├─ Bundle size: -XX KB
└─ Status: ✅ All tests passing
```

---

_Optimized for: reliability_
