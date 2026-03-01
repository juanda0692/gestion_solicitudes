---
name: modern-javascript-patterns
description: Applies modern JavaScript patterns and should be used when refactoring logic, improving maintainability, simplifying async flows, organizing modules, or removing outdated JavaScript practices.
license: Proprietary
metadata:
  owner: Tigo
  project: tigo-pdv-mvp
  priority: medium
compatibility: Cursor, Codex, repo-local skill
---

# modern-javascript-patterns

## Purpose
Use this skill to keep JavaScript code clean, modular, and maintainable as the project grows.

## Use when
- Refactoring utility modules
- Improving async flows
- Cleaning up data transformation code
- Reducing duplication
- Standardizing helper functions

## Do not use when
- The task is mainly SQL design
- The task is architecture-level threat modeling

## Project context
This project mixes frontend code, utility scripts, and automation logic. JavaScript should stay readable and low-risk as features evolve.

## Workflow
1. Review the current code structure
2. Identify outdated or overly complex patterns
3. Refactor toward small, focused functions
4. Improve async and error handling
5. Preserve readability over cleverness

## Output requirements
Return:
- refactored code
- short explanation of improvements
- maintainability notes
- possible follow-up cleanup ideas