# Excel Workbook Analysis: `KK_Farms_360_Goat_Management_System.xlsx`

**Status:** ⏳ **PENDING — the workbook has not been supplied to the engineering side as of 2026-11-07.**

The project brief describes it as 25 worksheets covering goat registration, breeding, pregnancy, kidding, weight, health, treatments, feeding, inventory, expenses, sales and dashboards, and asks that it be treated as an **operational reference, not a finalised specification**. Formulas and assumptions in it are not to be reproduced blindly.

> The workbook itself must **not** be committed to this repository (it may contain real animal/financial data; `.gitignore` blocks `*.xlsx`). Only this analysis is committed.

## How the analysis will be done (once received)

1. Inventory every sheet: name, purpose, row count, columns, data types, formulas, validation lists, cross-sheet references.
2. For each sheet, map columns → domain entities in [DOMAIN_MODEL.md](../DOMAIN_MODEL.md); note anything the model is missing.
3. Extract **business rules** encoded in formulas (e.g. expected kidding = mating + N days; ADG; cost allocations; alert thresholds) and record each as `[ASSUMED]` until the CEO/vet confirms.
4. Identify **data relationships** (how sheets reference each other — by animal number? by name?).
5. Identify **missing information** the software needs that the workbook does not hold.
6. Identify **duplicate or conflicting fields** (same fact in two sheets, different formats/values).
7. Derive **operational workflows** implied by the sheet order and dashboards.
8. List **questions requiring CEO confirmation** → append to [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md).
9. Assess **migration feasibility**: which sheets can seed Phase 1–3 data and what cleaning is needed.

## Template (to be filled)

### Sheet inventory

| # | Sheet | Purpose | Rows | Key columns | Formulas / rules | Maps to entity | Issues |
|---|-------|---------|------|-------------|------------------|----------------|--------|
| 1 | | | | | | | |
| … | | | | | | | |
| 25 | | | | | | | |

### Business rules found

| Rule | Where | Formula / logic | Status | Question |
|------|-------|-----------------|--------|----------|

### Relationships between sheets

### Missing information

### Duplicate / conflicting fields

### Candidate entities not yet in the domain model

### Workflows implied

### Questions for the CEO

### Migration assessment
