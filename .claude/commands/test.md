---
allowed-tools: all
description: Write and run comprehensive tests for code coverage
---

# /test

## Purpose

Creates comprehensive test coverage and ensures all tests pass.

## Arguments

Optional: `ARGUMENTS$` for specific components/features

## Execution

### Execution

SPAWN ALL TEST AGENTS IN PARALLEL (single message, multiple Task tools):

- tester: Write unit tests for business logic
- tester: Write integration tests for API/database
- tester: Write E2E tests for critical paths
- bugsy: Fix any failing tests
- murphy: Setup test environment/mocks

Coverage targets: Unit 70-80%, Integration for critical paths, E2E for workflows
Tools: Vitest for JS/TS, pytest for Python, MSW v2 for mocking

## Success Criteria

- Coverage reaches 70-80%
- All tests passing
- Edge cases covered
- Mocks appropriate
- Tests are maintainable

## Failure Protocol

When tests fail:

1. Fix implementation issues
2. Update tests if requirements changed
3. Add missing test cases

## Visual Response

Display coverage table:

```
| Type        | Coverage | Files | Status |
|-------------|----------|-------|--------|
| Unit        | XX%      | XX    | ✅/❌   |
| Integration | XX%      | XX    | ✅/❌   |
| E2E         | XX%      | XX    | ✅/❌   |
```

---

_Optimized for: reliability_
