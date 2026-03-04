# Compatibility Analysis: Main Repo vs External-KSEI

## Architecture Comparison

| Aspect | **Main Repo** (KSEI-Ownership-DB) | **External Repo** (external-ksei) |
|--------|----------------------------------|----------------------------------|
| **Framework** | Vanilla HTML/CSS/JS (single file) | React 19 + Vite 7 |
| **Structure** | Monolithic `index.html` (6,058 lines) | 14 JSX components + utility modules |
| **Data Loading** | Pre-processed `data.js` (inline JSON, ~2.2 MB) | Runtime XLSX parsing via `xlsx` library |
| **Dependencies** | Zero npm dependencies | `react`, `recharts`, `lightweight-charts`, `xlsx`, `@tanstack/react-virtual` |
| **Styling** | CSS-in-HTML with design tokens | Separate `index.css` (23 KB) |
| **Deployment** | Static file, GitHub Pages ready | Requires build step (`vite build`) |

## Data Schema Mapping

Both repos work with the same KSEI data. Only the naming convention differs:

| Main Repo (`snake_case`) | External Repo (`camelCase`) |
|---|---|
| `share_code` | `shareCode` |
| `issuer_name` | `issuerName` |
| `investor_name` | `investorName` |
| `investor_type` | `investorType` |
| `local_foreign` | `localForeign` |
| `nationality` | `nationality` |
| `domicile` | `domicile` |
| `holdings_scripless` | `holdingsScripless` |
| `holdings_scrip` | `holdingsScript` |
| `total_holding_shares` | `totalHoldingShares` |
| `percentage` | `percentage` |

When adapting code, replace `camelCase` field references with `snake_case`.

## Portable Business Logic (Can Adapt)

These utility functions are framework-agnostic pure JS:

| File | Functions | Purpose |
|---|---|---|
| `src/utils/analytics.js` | `getTopInvestors()` | Whale tracking — top investors across market |
| `src/utils/analytics.js` | `calculateOwnershipConcentration()` | Free float & ownership concentration |
| `src/utils/analytics.js` | `findConnectionPath()` | BFS pathfinding between two stocks via shared investors |
| `src/utils/analytics.js` | `getConglomerateStats()` | Aggregate stats for conglomerate groups |
| `src/utils/dataLoader.js` | `buildInvestorIndex()` | Cross-stock investor lookup index |
| `src/utils/dataLoader.js` | `getCrossStockLinks()` | Shareholders overlapping across stocks |
| `src/utils/dataLoader.js` | `getControllingShareholders()` | Filter shareholders >= 5% |
| `src/utils/dataLoader.js` | `formatNumber()`, `formatShares()` | Number formatting helpers |
| `src/utils/conglomerates.js` | `CONGLOMERATES` | Conglomerate group definitions (data) |

## Non-Portable (Requires Rewrite)

All 14 React components (`.jsx`) must be rewritten in vanilla JS:

- `WhaleTracker.jsx` — uses `recharts` (React-only charting)
- `NetworkGraph.jsx` — uses `lightweight-charts`
- `ShareholderTable.jsx` — uses `@tanstack/react-virtual`
- All components use React hooks (`useState`, `useEffect`, `useMemo`)

## Attribution Guidelines

When adapting features from external-ksei:

1. **Code comments**: Add `// Adapted from external-ksei: src/path/to/file.js — functionName()` 
2. **Commit messages**: Use `Co-authored-by: contributor <email>` trailer
3. **README**: Acknowledge adapted features in the Credits section
