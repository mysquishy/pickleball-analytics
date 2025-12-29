# CLAUDE.md - SaaS Behavioral Directives

## Memory First

ALWAYS before making decisions or after discovering anything:

```
store_daddy: [what you learned/decided/failed about multi-tenancy]
```

Check recall_daddy before assuming how multi-tenant patterns work.

## Delegate to SaaS Specialists

**STOP trying to do everything yourself.**

When you see SaaS tasks:

- Multi-tenant architecture → saasking agent
- Stripe subscriptions/webhooks → stripemaster agent
- NextAuth/multi-tenant auth → authguard agent
- Prisma multi-tenant schema → prismaking agent
- Transactional emails → emailking agent
- TypeScript → typegod agent
- React patterns → reactlord agent

Spawn multiple specialists IN PARALLEL when tasks span domains.

## Research Multi-Tenant Patterns First

Your training data is outdated on multi-tenancy. ALWAYS:

- Use WebSearch for "multi-tenant SaaS 2025 patterns"
- Use GREP MCP for real-world organizationId filtering patterns
- Use sherlock for Stripe/NextAuth multi-tenant implementations
- Never implement without researching current patterns

## Zero Tolerance for Multi-Tenant Violations

When building ANY feature:

- NO database queries without organizationId filter
- NO Stripe operations without metadata.organizationId
- NO session access without organizationId validation
- NO API routes without organization boundary checks
- If it doesn't respect org boundaries, it's not done

## No Silent Multi-Tenant Workarounds

**FORBIDDEN:**

- "I couldn't add organizationId filter so I used a global query"
- "Here's a workaround for cross-org access"
- Creating fallbacks that bypass isolation

**REQUIRED:**

- Report exact multi-tenant violation
- Stop immediately
- Ask user how to handle org boundaries

## Visual Over Verbal

Don't explain, SHOW:

```
❌ "I found data leak issues in 3 queries..."
✅ | Query Location    | Missing Filter | Severity |
   |-------------------|----------------|----------|
   | /api/projects     | organizationId | CRITICAL |
   | /api/users        | organizationId | CRITICAL |
```

## Simplicity Wins (KISS + YAGNI)

**KISS for SaaS:**

- Simple organizationId filter > Complex permission system
- Direct Prisma queries > Abstracted repository pattern
- 50 lines with filters > 200 lines with "flexibility"

**YAGNI for SaaS:**

- Build single-org features NOW, not multi-region architecture
- No "team hierarchy" without explicit requirement
- No "custom roles" if OWNER/ADMIN/MEMBER works
- Delete unused org-related code immediately

## File Discipline

- NEVER create files unless explicitly needed
- NEVER create documentation unless asked
- ALWAYS edit existing files vs creating new ones
- NEVER create "helper" files for org filtering (use lib/auth.ts)

## Speed Through Parallelization

When validating multi-tenancy:

- Test ALL queries for organizationId IN PARALLEL
- Check ALL API routes for auth IN PARALLEL
- Validate ALL Stripe webhooks IN PARALLEL

Example: `/check` spawns 6 agents AT ONCE to validate isolation.

## Multi-Tenant Testing Required

ALWAYS test cross-organization isolation:

- Create two orgs
- Create data in org1
- Attempt to access from org2 session
- MUST return null/403

If tests don't verify isolation, feature is incomplete.

## Don't Explain Unless Asked

- Build feature with org boundaries, show results
- Skip "I'll add organizationId filter..." preambles
- No lectures about multi-tenancy theory
- Working isolated data speaks for itself

---

**Core directive**: Delegate to SaaS agents, research multi-tenant patterns, zero tolerance for org boundary violations, test isolation always.
