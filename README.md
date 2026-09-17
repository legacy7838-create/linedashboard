# Internal Line Quality Portal

A client-side quality analytics dashboard for tracking **rejection**, **rework**, and **FQC fallout**
on production lines. Data is imported from Excel workbooks and visualized across six views.

> **VE Commercial Vehicles Limited** — Internal Line Quality Portal

---

## Overview

The portal has no server-side data store. It ships empty and populates entirely from an Excel file
you upload in the browser. Nothing is sent anywhere; parsing and analysis both happen on the client.

**Workflow:** open the portal → see the empty state → import a workbook → explore the dashboards.

## Features

- **Excel import** — multi-sheet workbooks, automatic header-row detection, flexible column
  matching (e.g. `part no.`, `part no`, `part number` all resolve to the same field)
- **Six views** — Dashboard, Analytics, Rejection, Rework, FQC Fallout, Reports
- **Filtering** — by month, machine/cell/line, shift, and free-text search
- **Charts** — trend, grouped bar, horizontal ranked, Pareto, comparison
- **KPI summary** — rejection/rework counts, quantities, and cost of poor quality
- **CSV export** — with spreadsheet formula-injection protection
- **Empty state** — every page renders a clear no-data state until a workbook is imported

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.3.5 (App Router, Turbopack) |
| UI | React 19.2.8, Tailwind CSS 4 |
| Charts | Recharts 3 |
| Icons | lucide-react |
| Spreadsheet parsing | SheetJS (`npm:@e965/xlsx@0.20.3`) |
| Language | TypeScript 5 |
| Compiler | React Compiler enabled |

React Compiler is on (`reactCompiler: true` in `next.config.ts`), so avoid manual memoization
unless profiling shows a specific need.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The portal loads with no data — click
**Import Excel File** and select a workbook to begin.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/                      # App Router pages
│   ├── page.tsx              # Dashboard
│   ├── analytics/            # Cross-cutting analytics
│   ├── rejection/            # Rejection analysis
│   ├── rework/               # Rework analysis
│   ├── fqc-fallout/          # FQC fallout analysis
│   ├── reports/              # Reports + CSV export
│   ├── settings/             # App settings, clear imported data
│   └── api/                  # API routes (empty-data endpoints)
├── components/
│   ├── charts/               # Chart components + lazy barrel (index.tsx)
│   ├── dashboard/            # Summary sections
│   ├── filters/              # Filter controls
│   ├── layout/               # Header, Sidebar
│   ├── tables/               # QualityTable
│   └── ui/                   # Card, KPICard, EmptyState, NoDataState, modal, pagination
├── context/
│   └── QualityDataContext.tsx  # Imported data + derived state
├── lib/
│   ├── calculations/         # KPI and aggregation logic
│   ├── constants/            # Company name, colors, column mappings
│   ├── hooks/                # useQualityDerivations, useDebouncedValue
│   ├── services/             # Excel parsing + data adapters
│   └── utils/                # Formatters
└── types/
    └── quality.ts            # Shared domain types
```

The `@/*` path alias maps to `./src/*`.

## Data Model

Three record types, discriminated by `QualityType`:

| Type | Description |
| --- | --- |
| `REJECTION` | Parts rejected during production |
| `REWORK` | Parts requiring rework |
| `FQC_FALLOUT` | Parts failing final quality check |

Core interfaces live in `src/types/quality.ts` — `QualityRecord`, `FQCRecord`, `KPISummary`,
and the aggregation result types (`DailyTrendItem`, `ParetoItem`, `MachineRankingItem`, etc.).

## Import Pipeline

All parsing is centralized in `src/lib/services/excelParser.ts`.

1. **Validate** — file size, row count, and sheet count are bounded before parsing
2. **Parse** — each sheet is scanned for a header row (first 12 rows)
3. **Map** — headers are matched against flexible aliases, so minor naming differences are tolerated
4. **Normalize** — dates handled in multiple formats (`.`, `/`, ISO, Excel serial numbers)
5. **Filter** — summary rows (`total`, `grand total`) and empty rows are dropped

**Limits** (exceeding any raises a typed `ExcelImportError`):

| Limit | Value |
| --- | --- |
| Max upload size | 10 MB |
| Max rows per sheet | 20,000 |
| Max sheets per workbook | 50 |

The parser is loaded on demand, not on first paint.

## Architecture Notes

**Client-side only.** No auth, database, or server-side file I/O. Imported data lives in React
state and is **lost on page reload** — there is currently no persistence layer.

**Lazy-loaded charts.** All charts are loaded through `src/components/charts/index.tsx` using
`next/dynamic` with `ssr: false`. Import from that barrel, not from the individual chart files,
or you will pull Recharts back into the initial bundle.

**Type-only imports matter here.** The `xlsx` parser is kept off the critical path, and that
depends on `import type` being used for type-only symbols:

```ts
import type { ExcelImportResult } from '@/lib/services/excelParser';
```

Using a value import for a type will silently drag the whole parser into the first-paint bundle.

**Shared derivations.** Pages consume `useQualityDerivations()` rather than recomputing
aggregations individually.

## Security

- **SheetJS patched** — `xlsx@0.18.5` carried CVE-2023-30533 (prototype pollution) and
  CVE-2024-22363 (ReDoS). Replaced with `npm:@e965/xlsx@0.20.3`. `npm audit` reports clean.
- **Formula injection blocked** — exported CSV cells beginning with `=`, `+`, `-`, `@`, tab, or CR
  are prefixed with an apostrophe so spreadsheet apps treat them as text.
- **Bounded parsing** — upload size, row count, and sheet count are capped (see above).
- **No XSS sinks** — no `dangerouslySetInnerHTML`, `innerHTML`, or `eval`. Excel-derived strings
  render through React, which escapes by default.

## Development Notes

This project uses a Next.js version with breaking changes relative to older releases. Check
`node_modules/next/dist/docs/` before writing framework code, and see `AGENTS.md` for the
project's agent instructions.

## Verification

```bash
npm audit          # 0 vulnerabilities
npx tsc --noEmit   # 0 errors
npm run lint       # 0 errors, 0 warnings
npm run build      # 16/16 pages generated
```
