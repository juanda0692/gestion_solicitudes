---
name: database-schema-designer
description: Designs database schemas and should be used when modeling entities, relationships, normalization boundaries, indexing strategy, audit fields, and domain-level data structures.
license: Proprietary
metadata:
  owner: Tigo
  project: tigo-pdv-mvp
  priority: high
compatibility: Cursor, Codex, repo-local skill
---

# database-schema-designer

## Purpose
Use this skill to model the business domain of the MVP clearly and sustainably.

## Use when
- Defining new entities and relationships
- Modeling requests, campaigns, materials, statuses, audit trails, or exports
- Evaluating normalization vs flexibility
- Designing lookup tables and transactional tables

## Do not use when
- The task is only tuning one SQL query
- The task is only reviewing UI code

## Project context
The data model must support multi-tenant access, auditable changes, future growth, and predictable reporting/exporting behavior.

## Workflow
1. Identify core entities and business rules
2. Define relationships and ownership boundaries
3. Add audit fields and operational metadata
4. Recommend indexing strategy based on expected access patterns
5. Flag anti-patterns or missing constraints

## Output requirements
Return:
- entities and relationships
- table-level recommendations
- normalization notes
- indexing suggestions
- anti-pattern warnings