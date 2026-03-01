---
name: supabase-audit-rls
description: Audits Supabase Row Level Security policies and should be used when validating tenant isolation, detecting permissive or missing policies, and checking for cross-tenant access or policy bypasses.
license: Proprietary
metadata:
  owner: Tigo
  project: tigo-pdv-mvp
  priority: critical
compatibility: Cursor, Codex, repo-local skill
---

# supabase-audit-rls

## Purpose
Use this skill to audit RLS policies for tenant isolation and secure data access.

## Use when
- Creating new tables with user access
- Reviewing SELECT/INSERT/UPDATE/DELETE policies
- Testing cross-tenant protections
- Preparing security review before staging or prod

## Project context
Every user-facing table should enforce tenant isolation and least privilege. Policies must distinguish read vs write and use safe WITH CHECK conditions.

## Workflow
1. Inspect tables and expected access model
2. Review all RLS policies
3. Identify missing or overly broad policies
4. Attempt conceptual bypass scenarios
5. Propose corrected SQL
6. Generate test cases

## Output requirements
Return:
- findings with severity
- exact SQL corrections
- test cases for allowed and denied actions