---
name: n8n-workflow-patterns
description: Designs reliable n8n workflows and should be used when creating exports, scheduled jobs, internal automation, retries, error handling, and secure workflow orchestration connected to Supabase or other services.
license: Proprietary
metadata:
  owner: juan
  project: tigo-pdv-mvp
  priority: high
compatibility: Cursor, Codex, repo-local skill
---

# n8n-workflow-patterns

## Purpose
Use this skill to design n8n workflows for internal automations and exports.

## Use when
- Building Excel export workflows
- Creating scheduled or triggered jobs
- Designing retry/error handling
- Connecting n8n with Supabase or storage

## Project context
n8n is used for jobs, exports, and internal automation. It is not the main public CRUD API. Workflows should be secure, observable, and resilient.

## Workflow
1. Define trigger and inputs
2. Define secure data fetch pattern
3. Transform data
4. Generate output or perform side effect
5. Log status and errors
6. Return or store result safely

## Output requirements
Return:
- workflow steps/nodes
- error handling plan
- retry considerations
- security notes