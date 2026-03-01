---
name: supabase-postgres-best-practices
description: Applies Supabase and Postgres best practices for schema design, indexes, query performance, security, and RLS, and should be used when creating tables, policies, migrations, or reviewing database design and performance.
license: Proprietary
metadata:
  owner: Tigo
  project: tigo-pdv-mvp
  priority: critical
compatibility: Cursor, Codex, repo-local skill
---

# supabase-postgres-best-practices

## Purpose
Use this skill to design and review Supabase/Postgres structures for the MVP.

## Use when
- Creating or modifying tables
- Designing indexes and constraints
- Writing SQL queries
- Reviewing RLS-related design
- Preparing migrations

## Project context
Database must support tenant isolation, auditability, stable exports, and production-ready growth. Prefer explicit constraints, FK integrity, audit fields, and indexes for tenant-filtered queries.

## Workflow
1. Review entities and access patterns
2. Propose schema, constraints, and indexes
3. Review RLS implications
4. Check for query/performance risks
5. Recommend migration-safe changes

## Output requirements
Return:
- SQL DDL or SQL changes
- index recommendations
- RLS considerations
- migration notes
- performance risks