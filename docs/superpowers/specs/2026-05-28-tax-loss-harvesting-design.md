# Tax Loss Harvesting Interface — Design Spec

**Date:** 2026-05-28  
**Stack:** Vite + React + TypeScript + Tailwind CSS  
**State:** React Context + useReducer

---

## 1. Overview

A single-page Tax Loss Harvesting tool that lets users select crypto holdings to "harvest" losses, updating capital gains calculations in real time. Built to match the KoinX Figma design.

---

## 2. Architecture

```
src/
├── api/
│   ├── holdings.ts          # Mock: returns Promise<Holding[]> with 200ms delay
│   └── capitalGains.ts      # Mock: returns Promise<CapitalGains> with 200ms delay
├── context/
│   └── HarvestContext.tsx   # Global state via useReducer
├── types/
│   └── index.ts             # Shared TypeScript interfaces
├── components/
│   ├── Header.tsx
│   ├── InfoBanner.tsx
│   ├── CapitalGainsCard.tsx  # Shared card used for both Pre and After
│   ├── HoldingsTable.tsx
│   └── HoldingsRow.tsx
├── hooks/
│   └── useHarvestCalc.ts    # Derives "after harvesting" values from selected holdings
├── App.tsx
└── main.tsx
```

---

## 3. Data Types

```ts
interface STCGorLTCG {
  balance: number;
  gain: number;
}

interface Holding {
  coin: string;        // ticker symbol e.g. "ETH"
  coinName: string;    // full name e.g. "Ethereum"
  logo: string;        // URL to coin image
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: STCGorLTCG;
  ltcg: STCGorLTCG;
}

interface GainsSplit {
  profits: number;
  losses: number;
}

interface CapitalGains {
  stcg: GainsSplit;
  ltcg: GainsSplit;
}

interface HarvestState {
  holdings: Holding[];
  capitalGains: CapitalGains | null;
  selectedKeys: Set<string>;   // composite key: `${coin}__${coinName}`
  showAll: boolean;
  loading: boolean;
  error: string | null;
}

type HarvestAction =
  | { type: 'SET_DATA'; holdings: Holding[]; capitalGains: CapitalGains }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'TOGGLE_COIN'; key: string }
  | { type: 'TOGGLE_ALL' }
  | { type: 'SET_SHOW_ALL'; value: boolean };
```

---

## 4. Mock APIs

Both live in `src/api/` and return typed Promises simulating a 200ms network delay via `setTimeout`.

- `fetchHoldings(): Promise<Holding[]>` — returns the 25-item holdings array
- `fetchCapitalGains(): Promise<CapitalGains>` — returns stcg/ltcg profits and losses

**Error contract:** Both functions may `throw` an `Error`. The app fetches both in parallel via `Promise.all`. If either fails, `SET_ERROR` is dispatched and an error banner replaces the cards and table. Partial failure (one succeeds, one fails) is treated the same as full failure — both results are needed to render correctly.

---

## 5. State (HarvestContext)

**Selection key:** Each holding is uniquely identified by the composite string `${coin}__${coinName}` (double underscore separator). This handles the two USDC entries in the data (`USDC__USDC` vs `USDC__Bridged USDC (Polygon PoS Bridge)`).

`selectedKeys` is a `Set<string>`. The `TOGGLE_ALL` action adds all keys if any are unselected, or clears the set if all are selected. Selections are not reset when toggling "View All".

---

## 6. Gains Calculation (`useHarvestCalc`)

STCG and LTCG gains are tracked **independently** — STCG gains only affect STCG profits/losses, and LTCG gains only affect LTCG profits/losses. They are never pooled across term types.

For each **selected** holding:
```ts
// STCG
if (holding.stcg.gain > 0) afterGains.stcg.profits += holding.stcg.gain
if (holding.stcg.gain < 0) afterGains.stcg.losses += Math.abs(holding.stcg.gain)
// LTCG — same pattern
if (holding.ltcg.gain > 0) afterGains.ltcg.profits += holding.ltcg.gain
if (holding.ltcg.gain < 0) afterGains.ltcg.losses += Math.abs(holding.ltcg.gain)
```

Derived values:
```ts
netSTCG = afterGains.stcg.profits - afterGains.stcg.losses   // can be negative
netLTCG = afterGains.ltcg.profits - afterGains.ltcg.losses   // can be negative
realisedAfter = netSTCG + netLTCG                            // can be negative

// Pre-harvesting (from API, never changes):
netSTCGBefore = capitalGains.stcg.profits - capitalGains.stcg.losses
netLTCGBefore = capitalGains.ltcg.profits - capitalGains.ltcg.losses
realisedBefore = netSTCGBefore + netLTCGBefore

// Show savings badge only when the user would owe less tax:
showSavings = realisedBefore > realisedAfter
savings = realisedBefore - realisedAfter   // always positive when showSavings is true
```

Sign display: All monetary values in the UI show their sign explicitly. Positive values render in green; negative values render in red with a leading "−" symbol.

---

## 7. UI Components

### Header
KoinX★ logo + "Tax Harvesting" title + "How it works?" link (non-functional, decorative).

### InfoBanner
Collapsible panel (open by default, toggled by chevron). Contains 4 disclaimer bullet points per the Figma spec.

### CapitalGainsCard
Props: `title: string`, `gains: CapitalGains`, `realisedLabel: string`, `variant: 'dark' | 'blue'`, `savings?: number`

- Table layout: rows = Profits / Losses / Net Capital Gains; columns = Short-term / Long-term
- `variant='dark'`: white background, label "Realised Capital Gains"
- `variant='blue'`: blue (`#2563eb`) background, label "Effective Capital Gains"
- Blue card shows savings badge (`🔥 You are going to save upto ₹{savings}`) only when `savings` prop is provided and positive

### HoldingsTable
- Default: shows first 5 rows sorted by descending `|stcg.gain| + |ltcg.gain|` (most impactful first)
- "View all" button at bottom expands in-place to show all rows; toggles back to "Show less"
- Existing selections are preserved across view toggle
- Columns: Asset | Holdings / Avg Buy Price | Current Price | Short-term (gain / balance) | Long-term (gain / balance) | Amount to Sell
- "Amount to Sell" shows `totalHolding` formatted with coin symbol when row is selected, "—" otherwise
- Selected rows highlighted with `bg-blue-50`
- Select-all checkbox in header: checked when all visible rows are selected, indeterminate when some are, unchecked when none are

### HoldingsRow
- Coin logo loaded via `<img>` with fallback to a grey placeholder circle showing the ticker's first 3 chars
- Gain values: green when positive, red when negative, grey "—" when zero

### Loading State
Skeleton placeholders (animated pulse) on cards and table rows while `loading === true`.

### Error State
Full-width red error banner replaces cards and table when `error !== null`. Shows message + a "Retry" button that re-fetches both APIs.

---

## 8. Responsiveness

- Cards stack vertically on `< 768px`
- Holdings table scrolls horizontally on mobile (`overflow-x: auto` wrapper)
- Info banner and header remain readable at all breakpoints

---

## 9. Decisions

| Decision | Choice | Reason |
|---|---|---|
| Styling | Tailwind CSS | Fast iteration, no runtime CSS-in-JS overhead |
| Language | TypeScript | Type safety on API shapes and gain calculations |
| State | Context + useReducer | Right-sized; no extra deps, no prop drilling |
| API mock | In-app Promises | Assignment explicitly allows; zero infra needed |
| Coin unique key | `${coin}__${coinName}` | Handles two USDC entries with different coinNames |
| Default sort | Abs gain descending | Surfaces high-impact holdings first for harvesting |
| Parallel fetch | Promise.all | Fail-fast if either API is broken |

---

## 10. Out of Scope

- Real API integration or authentication
- Persisting selections across page reloads
- Wash-sale rule enforcement (disclaimer is shown in InfoBanner)
- Tax jurisdiction logic (Indian tax rules noted in disclaimer only)
- Pagination (replaced by simple "View All" in-place expand)
- Currency conversion (all values shown in ₹ as provided by mock data)
