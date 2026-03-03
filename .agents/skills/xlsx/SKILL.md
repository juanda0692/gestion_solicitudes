---
name: xlsx
description: Generates and formats Excel workbooks and should be used when building spreadsheet exports, reports, multi-sheet files, formatted business outputs, or template-based Excel generation.
license: Proprietary
metadata:
  owner: juan
  project: tigo-pdv-mvp
  priority: high
compatibility: Cursor, Codex, repo-local skill
---

# xlsx

## Purpose
Use this skill for business-ready Excel output.

## Use when
- Exporting filtered business data
- Building reports for client use
- Defining columns, formats, and workbook structure
- Preparing multi-sheet output

## Project context
Exports must be usable by business users, consistently formatted, and safe for tenant-scoped data only.

## Workflow
1. Define export scope and filters
2. Define workbook and sheet structure
3. Define columns and formatting
4. Generate workbook
5. Validate output consistency
6. Consider spreadsheet injection risks if user content is included

## Output requirements
Return:
- workbook structure
- columns and formatting rules
- generation code
- validation notes