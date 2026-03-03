---
name: database-migration
description: Plans and reviews database migrations and should be used when creating migration scripts, evolving schemas safely, handling rollbacks, preparing staged database changes, or reducing risk during production schema updates.
license: Proprietary
metadata:
  owner: Tigo
  project: tigo-pdv-mvp
  priority: medium-high
compatibility: Cursor, Codex, repo-local skill
---

# database-migration

## Purpose
Use this skill to evolve the database safely over time as the MVP grows from local development to staging and production.

## Use when
- Creating or reviewing migration scripts
- Renaming or splitting columns/tables
- Introducing new constraints or indexes
- Planning schema evolution without breaking the app
- Preparing rollback strategies

## Do not use when
- The task is only a one-off query analysis
- The task is purely frontend work

## Project context
This project uses Supabase Postgres and should grow organically from development to client-owned environments. Schema changes must be auditable, low-risk, and reversible where possible.

## Workflow
1. Review current schema and dependent code paths
2. Identify backward compatibility risks
3. Propose additive-first migration strategy when possible
4. Define rollback or fallback plan
5. Highlight data migration needs
6. Suggest verification steps after migration

## Output requirements
Return:
- migration plan
- SQL migration steps
- rollback notes
- compatibility risks
- post-migration validation checklist