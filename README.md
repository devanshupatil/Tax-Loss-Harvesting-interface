# Tax Loss Harvesting Interface

A single-page tool that lets crypto investors select holdings to "harvest" losses and see the Before/After impact on their capital gains in real time. Built to match the KoinX Figma design.

## Quick Start

```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173)

## What It Does

Select any combination of holdings from the table. The two capital gains cards update instantly:

| Card | Background | Label |
|------|-----------|-------|
| Pre Harvesting | White | Realised Capital Gains |
| After Harvesting | Blue (`#2563eb`) | Effective Capital Gains |

Each card shows a Short-term / Long-term breakdown (Profits, Losses, Net Capital Gains). The After card shows a savings badge — _"You are going to save upto ₹{amount}"_ — when harvesting reduces your total realised gains.

The holdings table displays 5 rows by default with a **View All** toggle to expand to all 25. A collapsible disclaimer banner sits above the cards with compliance notes.

## Stack

- Vite 5 + React 18 + TypeScript 5
- Tailwind CSS 3
- React Context + `useReducer` for state
- Vitest + jsdom for unit tests

## Commands

```bash
bun run dev                                          # dev server
bun run build                                        # type-check + production build
bun run test                                         # run all tests
bunx vitest run src/hooks/useHarvestCalc.test.ts     # run one test file
bun run preview                                      # preview the production build
```

## Project Structure

```
src/
  api/            # mock data — replace fetchHoldings / fetchCapitalGains to wire a real API
  components/     # Header, InfoBanner, CapitalGainsCard, HoldingsTable, HoldingsRow
  context/        # HarvestContext — single useReducer store for all app state
  hooks/          # useHarvestCalc — all gains math lives here
  types/          # shared TypeScript interfaces (Holding, CapitalGains, ComputedGains)
  utils/          # INR currency formatting
```

All state is owned by `HarvestContext`. Components read from context or dispatch actions — none fetch or compute gains themselves. The `useHarvestCalc` hook is the only place arithmetic happens and is the primary unit-test target.
