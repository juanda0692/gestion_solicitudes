---
name: vercel-composition-patterns
description: Applies component composition patterns and should be used when structuring reusable React components, feature modules, layout primitives, or scalable UI architecture.
license: Proprietary
metadata:
  owner: juan
  project: tigo-pdv-mvp
  priority: medium-high
compatibility: Cursor, Codex, repo-local skill
---

# vercel-composition-patterns

## Purpose
Use this skill to structure React components in a scalable way using composition over duplication.

## Use when
- Creating reusable UI building blocks
- Organizing feature modules
- Splitting large components into smaller parts
- Designing layout wrappers and shared patterns
- Improving long-term frontend scalability

## Do not use when
- The task is a quick one-line bug fix
- The task is security or database analysis

## Project context
The frontend should start simple but evolve without turning into large, tightly coupled components. Reusable composition patterns help the project scale cleanly.

## Workflow
1. Review current component boundaries
2. Identify duplicated UI patterns
3. Extract reusable composition pieces
4. Preserve clarity and business intent
5. Avoid over-abstraction too early

## Output requirements
Return:
- proposed component breakdown
- composition strategy
- shared primitives or wrappers
- cautions against premature abstraction