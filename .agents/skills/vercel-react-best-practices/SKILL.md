---
name: vercel-react-best-practices
description: Applies React best practices for maintainability and performance and should be used when building or reviewing components, data fetching flows, rendering strategy, state updates, and frontend structure for production readiness.
license: Proprietary
metadata:
  owner: Tigo
  project: tigo-pdv-mvp
  priority: high
compatibility: Cursor, Codex, repo-local skill
---

# vercel-react-best-practices

## Purpose
Use this skill to keep React code efficient, readable, and production-ready as the frontend grows.

## Use when
- Building feature screens
- Reviewing component performance
- Optimizing render behavior
- Improving data fetching or state flow
- Organizing frontend code for long-term maintainability

## Do not use when
- The task is only backend validation
- The task is only database migration planning

## Project context
The MVP frontend must grow organically with Supabase and Vercel while staying maintainable, responsive, and easy to extend for future modules.

## Workflow
1. Review component responsibilities
2. Identify rendering or state management issues
3. Improve structure and data flow
4. Reduce unnecessary re-renders
5. Keep the component tree understandable

## Output requirements
Return:
- issues found
- refactoring suggestions
- improved component structure
- performance notes