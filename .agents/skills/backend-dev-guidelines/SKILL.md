---
name: backend-dev-guidelines
description: Applies backend implementation guidelines with validation, middleware, error handling, and Zod schemas, and should be used when implementing Edge Functions, request validation, secure backend workflows, or standardized backend responses.
license: Proprietary
metadata:
  owner: juan
  project: tigo-pdv-mvp
  priority: high
compatibility: Cursor, Codex, repo-local skill
---

# backend-dev-guidelines

## Purpose
Use this skill to implement backend validation and consistent endpoint behavior.

## Use when
- Creating Edge Functions
- Validating request payloads
- Standardizing backend errors
- Adding middleware or shared backend utilities

## Project context
All sensitive backend entry points must validate input, reject malformed data safely, and return consistent errors without exposing internals.

## Workflow
1. Define input/output schema
2. Implement Zod validation
3. Handle invalid input safely
4. Apply auth/authz checks
5. Return consistent success/error responses
6. Suggest tests for valid/invalid payloads

## Output requirements
Return:
- Zod schema
- endpoint validation code
- error response format
- test cases