---
name: api-patterns
description: Defines secure and consistent API patterns and should be used when designing Edge Functions, backend endpoints, request and response contracts, authentication, authorization, rate limiting, pagination, error handling, and API security tests.
license: Proprietary
metadata:
  owner: juan
  project: tigo-pdv-mvp
  priority: critical
compatibility: Cursor, Codex, repo-local skill
---

# api-patterns

## Purpose
Use this skill for secure API and Edge Function design in this project.

## Use when
- Creating Edge Functions
- Designing sensitive endpoints like exports or approvals
- Defining request/response contracts
- Adding auth/authz, rate limiting, or API security tests

## Do not use when
- The task is only a DB migration with no endpoint
- The task is purely frontend styling

## Project context
Sensitive operations should go through controlled backend or Edge Functions. n8n is not the public CRUD API. APIs must enforce tenant isolation, validation, safe errors, and auditable behavior.

## Workflow
1. Define endpoint purpose and actor
2. Define request and response schema
3. Add auth/authz checks
4. Add validation and safe error handling
5. Consider rate limiting and abuse prevention
6. Produce security tests, including OWASP API-style cases

## Output requirements
Return:
- endpoint contract
- validation rules
- auth/authz logic
- error model
- security test cases