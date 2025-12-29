---
allowed-tools: all
description: Create natural git commits and push to remote
---

# /commit

## Purpose

Creates human-style git commits and syncs with remote repository.

## Arguments

Optional: `ARGUMENTS$` for commit context

## Execution

### Execution

Sequential flow (single gitty agent):

1. gitty: Review staged/unstaged changes
2. gitty: Generate natural commit message
3. gitty: Create commit with human wording
4. gitty: Push to remote repository

Commit style: Human-like, conversational, no AI-speak

## Success Criteria

- Commit message sounds human
- Changes committed locally
- Pushed to remote
- No conflicts

## Failure Protocol

When push fails:

1. Pull latest changes
2. Resolve conflicts if any
3. Retry push

## Visual Response

```
📝 Commit: "[commit message]"
📊 Changes: X files, +Y lines, -Z lines
🔄 Branch: [branch] → [remote]
✅ Pushed successfully
```

---

_Optimized for: speed_
