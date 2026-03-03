---
name: api-security-best-practices
description: Applies API security best practices and should be used when hardening endpoints, reviewing auth and authorization, validating input, limiting abuse, securing errors, and reducing common API attack risks.
license: Proprietary
metadata:
  owner: juan
  project: tigo-pdv-mvp
  priority: high
compatibility: Cursor, Codex, repo-local skill
---

# api-security-best-practices

## Purpose
Use this skill to harden backend endpoints and Edge Functions against common API security failures.

## Use when
- Reviewing sensitive endpoints
- Designing auth and authorization checks
- Adding abuse prevention
- Improving secure error behavior
- Reviewing API risks before staging or production

## Do not use when
- The task is only response shape design with no security concern
- The task is purely frontend UI work

## Project context
Endpoints in this project may expose exports, approvals, filters, and tenant-scoped data. Security controls must prevent unauthorized access, excessive usage, and unsafe input handling.

## Workflow
1. Identify actor, asset, and endpoint behavior
2. Review auth/authz expectations
3. Validate input and output safety
4. Add abuse protection and safe error rules
5. Produce security test ideas

## Output requirements
Return:
- risks found
- recommended controls
- validation requirements
- abuse prevention notes
- security tests