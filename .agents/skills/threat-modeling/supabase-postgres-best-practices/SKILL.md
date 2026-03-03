---
name: threat-modeling
description: Performs threat modeling for application architecture using STRIDE and should be used when designing or reviewing system architecture, APIs, webhooks, exports, authentication, tenant isolation, or other security-sensitive flows.
license: Proprietary
metadata:
  owner: Tigo
  project: tigo-pdv-mvp
  priority: critical
compatibility: Cursor, Codex, repo-local skill
---

# threat-modeling

## Purpose
Use this skill to analyze architecture-level security risks in the Tigo PDV materials and campaigns MVP.

## Use when
- Designing new features or integrations
- Reviewing React -> Supabase -> Edge Functions -> n8n flows
- Adding exports, webhooks, auth/authz, or cross-tenant access paths
- Preparing staging or production hardening

## Do not use when
- The task is only styling a component
- The task is a simple local refactor with no security or architecture impact

## Project context
This project uses React frontend, Supabase for Postgres/Auth/RLS, Edge Functions for sensitive operations, and n8n for exports/jobs. n8n must not be used as the main CRUD API. Multi-tenant isolation is required.

## Workflow
1. Build a textual DFD of the relevant flow
2. Identify assets, trust boundaries, entry points, and actors
3. Apply STRIDE to each component/flow
4. Prioritize threats by severity and likelihood
5. Propose mitigations
6. Convert mitigations into implementation tasks and test cases

## Output requirements
Return:
- textual DFD
- threat register with severity
- mitigations
- validation tests
- backlog/checklist items