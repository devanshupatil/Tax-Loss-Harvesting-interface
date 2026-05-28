# Tax Loss Harvesting Interface — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive Tax Loss Harvesting interface in React + TypeScript + Tailwind CSS that displays capital gains pre/post harvesting and updates in real time as users toggle holdings checkboxes.

**Architecture:** Vite + React + TypeScript SPA. Context + useReducer manages global state (holdings, selectedKeys Set, loading, error, showAll). Two inline Promise-based mock APIs (200ms delay) feed data. `useHarvestCalc` hook derives after-harvesting gains from selected holdings. Components are small and single-purpose.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3, Vitest (gains calc unit tests)

**Working directory:** `/home/devanshu/Tax Loss Harvesting interface`

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite + Vitest config |
| `tsconfig.json` | TypeScript compiler options |
| `tsconfig.node.json` | TS config for vite.config.ts |
| `tailwind.config.js` | Tailwind content paths |
| `postcss.config.js` | PostCSS plugins |
| `index.html` | App shell HTML |
| `src/main.tsx` | React root mount |
| `src/index.css` | Tailwind directives + base reset |
| `src/test-setup.ts` | Vitest + jest-dom setup |
| `src/types/index.ts` | All shared TypeScript interfaces |
| `src/api/holdings.ts` | Mock holdings API — 25-item array, Promise<Holding[]> |
| `src/api/capitalGains.ts` | Mock capital gains API — Promise<CapitalGains> |
| `src/context/HarvestContext.tsx` | useReducer state, Context, Provider, custom hook |
| `src/hooks/useHarvestCalc.ts` | Derives after-harvesting ComputedGains from state |
| `src/utils/format.ts` | Currency and crypto amount formatting |
| `src/components/Header.tsx` | KoinX logo + page title bar |
| `src/components/InfoBanner.tsx` | Collapsible disclaimer banner |
| `src/components/CapitalGainsCard.tsx` | Shared card (dark/blue variant) with gains table |
| `src/components/HoldingsRow.tsx` | Single holding table row |
| `src/components/HoldingsTable.tsx` | Full holdings table with select-all and view-all |
| `src/App.tsx` | Data fetch, layout, Provider wiring |

---

### Task 1: Project Scaffold

**Files:** `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "tax-loss-harvesting",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.6",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.3",
    "vite": "^5.3.4",
    "vitest": "^2.0.3"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    globals: true,
  },
})
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 6: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tax Loss Harvesting — KoinX</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Install dependencies**

```bash
npm install
```

Expected: `node_modules` created, 0 vulnerabilities (or low severity only).

- [ ] **Step 9: Commit**

```bash
git init && git add package.json vite.config.ts tsconfig.json tsconfig.node.json tailwind.config.js postcss.config.js index.html && git commit -m "chore: scaffold Vite + React + TypeScript + Tailwind"
```

---

### Task 2: Entry Point & Global Styles

**Files:** `src/main.tsx`, `src/index.css`, `src/test-setup.ts`, `src/App.tsx` (placeholder)

- [ ] **Step 1: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Step 2: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Create `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 4: Create placeholder `src/App.tsx`**

```tsx
export default function App() {
  return <div className="p-4 text-gray-800">Tax Loss Harvesting — Loading...</div>
}
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:5173` — expect to see "Tax Loss Harvesting — Loading..." text.

- [ ] **Step 6: Commit**

```bash
git add src/ && git commit -m "chore: add entry point, global styles, and test setup"
```

---

### Task 3: TypeScript Types

**Files:** `src/types/index.ts`

- [ ] **Step 1: Create `src/types/index.ts`**

```ts
export interface STCGorLTCG {
  balance: number
  gain: number
}

export interface Holding {
  coin: string        // ticker e.g. "ETH"
  coinName: string    // full name e.g. "Ethereum"
  logo: string        // image URL
  currentPrice: number
  totalHolding: number
  averageBuyPrice: number
  stcg: STCGorLTCG
  ltcg: STCGorLTCG
}

export interface GainsSplit {
  profits: number
  losses: number
}

export interface CapitalGains {
  stcg: GainsSplit
  ltcg: GainsSplit
}

export interface ComputedGains {
  gains: CapitalGains
  netSTCG: number
  netLTCG: number
  realised: number
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/ && git commit -m "feat: add TypeScript type definitions"
```

---

### Task 4: Mock APIs

**Files:** `src/api/capitalGains.ts`, `src/api/holdings.ts`

- [ ] **Step 1: Create `src/api/capitalGains.ts`**

```ts
import type { CapitalGains } from '../types'

const DATA: CapitalGains = {
  stcg: { profits: 70200.88, losses: 1548.53 },
  ltcg: { profits: 5020, losses: 3050 },
}

export function fetchCapitalGains(): Promise<CapitalGains> {
  return new Promise((resolve) => setTimeout(() => resolve(DATA), 200))
}
```

- [ ] **Step 2: Create `src/api/holdings.ts`**

```ts
import type { Holding } from '../types'

const DATA: Holding[] = [
  { coin: 'USDC', coinName: 'USDC', logo: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694', currentPrice: 85.41, totalHolding: 0.0015339999999994802, averageBuyPrice: 1.5863185433764244, stcg: { balance: 0.0015339999999994802, gain: 0.12858552735441697 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'WETH', coinName: 'Polygon PoS Bridged WETH (Polygon POS)', logo: 'https://coin-images.coingecko.com/coins/images/2518/large/weth.png?1696503332', currentPrice: 211756, totalHolding: 0.00023999998390319965, averageBuyPrice: 3599.856066001555, stcg: { balance: 0.00023999998390319965, gain: 49.957471193511736 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'SOL', coinName: 'SOL (Wormhole)', logo: 'https://coin-images.coingecko.com/coins/images/22876/large/SOL_wh_small.png?1696522175', currentPrice: 14758.01, totalHolding: 3.469446951953614e-17, averageBuyPrice: 221.42847548590152, stcg: { balance: 3.469446951953614e-17, gain: 5.043389846205066e-13 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'WPOL', coinName: 'Wrapped POL', logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg', currentPrice: 22.08, totalHolding: 2.3172764293128694, averageBuyPrice: 0.5227311370876341, stcg: { balance: 1.3172764293128694, gain: 49.954151016387065 }, ltcg: { balance: 1, gain: 20 } },
  { coin: 'MATIC', coinName: 'Polygon', logo: 'https://coin-images.coingecko.com/coins/images/4713/large/polygon.png?1698233745', currentPrice: 22.22, totalHolding: 2.75145540184285, averageBuyPrice: 0.6880274617804887, stcg: { balance: 2.75145540184285, gain: 59.244262152615974 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'GONE', coinName: 'Gone', logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg', currentPrice: 0.0001462, totalHolding: 696324.3075326696, averageBuyPrice: 0.00001637624055112482, stcg: { balance: 696324.3075326696, gain: 90.39943939952589 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'USDT', coinName: 'Arbitrum Bridged USDT (Arbitrum)', logo: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661', currentPrice: 85.42, totalHolding: 0.0001580000000558357, averageBuyPrice: 1.4988059369185402, stcg: { balance: 0.0001580000000558357, gain: 0.01325954866665267 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'USDC', coinName: 'Bridged USDC (Polygon PoS Bridge)', logo: 'https://coin-images.coingecko.com/coins/images/33000/large/usdc.png?1700119918', currentPrice: 85.41, totalHolding: 0.005806999999992795, averageBuyPrice: 1.5405071277176852, stcg: { balance: 0.005806999999992795, gain: 0.48703014510873915 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'SLN', coinName: 'Smart Layer Network', logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg', currentPrice: 6.66, totalHolding: 0.01, averageBuyPrice: 4.999247835735738, stcg: { balance: 0.01, gain: 0.016607521642642627 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'OX', coinName: 'OX Coin', logo: 'https://coin-images.coingecko.com/coins/images/35365/large/logo.png?1708395976', currentPrice: 0.13319, totalHolding: 5, averageBuyPrice: 0.018408606024462898, stcg: { balance: 5, gain: 0.5739069698776855 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'FLAME', coinName: 'FireStarter', logo: 'https://coin-images.coingecko.com/coins/images/17359/large/WhiteOnBlack_Primary_Logo.png?1696516910', currentPrice: 0.355985, totalHolding: 1.4210854715202004e-14, averageBuyPrice: 0.07889041030290807, stcg: { balance: 1.4210854715202004e-14, gain: 3.9377509565538836e-15 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'PIG', coinName: 'Pigcoin', logo: 'https://coin-images.coingecko.com/coins/images/35425/large/pigcoin_200.png?1708544734', currentPrice: 0.00008706, totalHolding: 1.79, averageBuyPrice: 0, stcg: { balance: 1.79, gain: 0.0001558374 }, ltcg: { balance: 0, gain: 0 } },
  { coin: '$CULO', coinName: 'CULO', logo: 'https://coin-images.coingecko.com/coins/images/34662/large/CULO-logo-inverted_200.png?1705641744', currentPrice: 0.00001623, totalHolding: 150000, averageBuyPrice: 0, stcg: { balance: 150000, gain: 2.4345 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'ETH', coinName: 'Ethereum', logo: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628', currentPrice: 216182, totalHolding: 0.0004211938732637162, averageBuyPrice: 3909.792264648455, stcg: { balance: 0.0004211938732637162, gain: 89.40775336229291 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'QUICK', coinName: 'Quickswap [OLD]', logo: 'https://coin-images.coingecko.com/coins/images/13970/large/quick.png?1696513704', currentPrice: 2319.83, totalHolding: 5.961538207532868e-11, averageBuyPrice: 65.86759737193783, stcg: { balance: 5.961538207532868e-11, gain: 1.3437082981609774e-7 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'DFYN', coinName: 'Dfyn Network', logo: 'https://coin-images.coingecko.com/coins/images/15368/large/SgqhfWz4_400x400_%281%29.jpg?1696515016', currentPrice: 0.300613, totalHolding: 3.1178615245153196e-11, averageBuyPrice: 0.03486178524947315, stcg: { balance: 3.1178615245153196e-11, gain: 8.285754875638759e-12 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'LINK', coinName: 'Chainlink', logo: 'https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009', currentPrice: 1450.14, totalHolding: 0.000047233224826389, averageBuyPrice: 9.172984515948809, stcg: { balance: 0.000047233224826389, gain: 0.06806151900976895 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'BLOK', coinName: 'Bloktopia', logo: 'https://coin-images.coingecko.com/coins/images/18819/large/logo-bholdus-6.png?1696518281', currentPrice: 0.02974533, totalHolding: 9.822542779147625e-11, averageBuyPrice: 0.005182145656093, stcg: { balance: 9.822542779147625e-11, gain: 2.412729290101157e-12 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'SPHERE', coinName: 'Sphere Finance', logo: 'https://coin-images.coingecko.com/coins/images/24424/large/2iR2JsL.png?1696523606', currentPrice: 0.00729945, totalHolding: 2.2737367544323206e-13, averageBuyPrice: 0.011065778585432803, stcg: { balance: 2.2737367544323206e-13, gain: -8.563639733967655e-16 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'TRADE', coinName: 'Polytrade', logo: 'https://coin-images.coingecko.com/coins/images/16416/large/Logo_colored_200.png?1696516012', currentPrice: 17.51, totalHolding: 3.325212327709437e-11, averageBuyPrice: 0.25960465528043797, stcg: { balance: 3.325212327709437e-11, gain: 5.736122725812298e-10 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'WELT', coinName: 'Fabwelt', logo: 'https://coin-images.coingecko.com/coins/images/20505/large/welt.PNG?1696519911', currentPrice: 0.060863, totalHolding: 1.063542780948968, averageBuyPrice: 0.01520546569793174, stcg: { balance: 1.063542780948968, gain: 0.048558741002894576 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'FTM', coinName: 'Fantom', logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg', currentPrice: 52.99, totalHolding: 0.04265758808550148, averageBuyPrice: 1.7040326829291739, stcg: { balance: 0.04265758808550148, gain: 2.1877356683780986 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'EZ', coinName: 'EasyFi V2', logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg', currentPrice: 0.885074, totalHolding: 0.0005424384664524931, averageBuyPrice: 6.539367177529248, stcg: { balance: 0.0005424384664524931, gain: -0.0030671061200917595 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'FRM', coinName: 'Ferrum Network', logo: 'https://coin-images.coingecko.com/coins/images/8251/large/FRM.png?1696508455', currentPrice: 0.093794, totalHolding: 6.442993445432421e-7, averageBuyPrice: 0.453964789704584, stcg: { balance: 6.442993445432421e-7, gain: -2.3205780373028534e-7 }, ltcg: { balance: 0, gain: 0 } },
  { coin: 'TITAN', coinName: 'IRON Titanium', logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg', currentPrice: 8.65643e-7, totalHolding: 8.861, averageBuyPrice: 8.531798889329416e-7, stcg: { balance: 8.861, gain: 1.1043562716520403e-7 }, ltcg: { balance: 0, gain: 0 } },
]

export function fetchHoldings(): Promise<Holding[]> {
  return new Promise((resolve) => setTimeout(() => resolve(DATA), 200))
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/api/ && git commit -m "feat: add mock holdings and capital gains APIs"
```

---

### Task 5: Format Utilities

**Files:** `src/utils/format.ts`

- [ ] **Step 1: Create `src/utils/format.ts`**

```ts
export function formatCurrency(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  if (abs === 0) return '₹0.00'
  if (abs < 0.01) return `${sign}₹${abs.toExponential(2)}`
  return `${sign}₹${abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatAmount(value: number, coin: string): string {
  const abs = Math.abs(value)
  if (abs === 0) return `0 ${coin}`
  if (abs < 1e-8) return `~0 ${coin}`
  if (abs < 0.0001) return `${abs.toExponential(3)} ${coin}`
  return `${abs.toLocaleString('en-IN', { maximumFractionDigits: 6 })} ${coin}`
}

export function formatPrice(value: number): string {
  if (value === 0) return '₹0'
  if (value < 0.001) return `₹${value.toExponential(3)}`
  if (value >= 1000) return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/ && git commit -m "feat: add currency and amount formatting utilities"
```

---

### Task 6: Context + Reducer

**Files:** `src/context/HarvestContext.tsx`

- [ ] **Step 1: Create `src/context/HarvestContext.tsx`**

```tsx
import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Holding, CapitalGains } from '../types'

interface HarvestState {
  holdings: Holding[]
  capitalGains: CapitalGains | null
  selectedKeys: Set<string>
  showAll: boolean
  loading: boolean
  error: string | null
}

type HarvestAction =
  | { type: 'SET_DATA'; holdings: Holding[]; capitalGains: CapitalGains }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'TOGGLE_COIN'; key: string }
  | { type: 'TOGGLE_ALL'; allKeys: string[] }
  | { type: 'SET_SHOW_ALL'; value: boolean }

function holdingKey(h: Holding): string {
  return `${h.coin}__${h.coinName}`
}

const initialState: HarvestState = {
  holdings: [],
  capitalGains: null,
  selectedKeys: new Set(),
  showAll: false,
  loading: true,
  error: null,
}

function reducer(state: HarvestState, action: HarvestAction): HarvestState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, holdings: action.holdings, capitalGains: action.capitalGains, loading: false, error: null }
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.error }
    case 'TOGGLE_COIN': {
      const next = new Set(state.selectedKeys)
      if (next.has(action.key)) next.delete(action.key)
      else next.add(action.key)
      return { ...state, selectedKeys: next }
    }
    case 'TOGGLE_ALL': {
      const allSelected = action.allKeys.every((k) => state.selectedKeys.has(k))
      const next = new Set(state.selectedKeys)
      if (allSelected) {
        action.allKeys.forEach((k) => next.delete(k))
      } else {
        action.allKeys.forEach((k) => next.add(k))
      }
      return { ...state, selectedKeys: next }
    }
    case 'SET_SHOW_ALL':
      return { ...state, showAll: action.value }
    default:
      return state
  }
}

interface HarvestContextValue {
  state: HarvestState
  dispatch: React.Dispatch<HarvestAction>
  holdingKey: (h: Holding) => string
}

const HarvestContext = createContext<HarvestContextValue | null>(null)

export function HarvestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <HarvestContext.Provider value={{ state, dispatch, holdingKey }}>
      {children}
    </HarvestContext.Provider>
  )
}

export function useHarvest(): HarvestContextValue {
  const ctx = useContext(HarvestContext)
  if (!ctx) throw new Error('useHarvest must be used inside HarvestProvider')
  return ctx
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/context/ && git commit -m "feat: add HarvestContext with useReducer state management"
```

---

### Task 7: useHarvestCalc Hook + Tests

**Files:** `src/hooks/useHarvestCalc.ts`, `src/hooks/useHarvestCalc.test.ts`

- [ ] **Step 1: Write failing tests — create `src/hooks/useHarvestCalc.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { computeAfterGains } from './useHarvestCalc'
import type { CapitalGains, Holding } from '../types'

const baseGains: CapitalGains = {
  stcg: { profits: 100, losses: 500 },
  ltcg: { profits: 1200, losses: 100 },
}

function makeHolding(stcgGain: number, ltcgGain: number): Holding {
  return {
    coin: 'ETH', coinName: 'Ethereum', logo: '', currentPrice: 100,
    totalHolding: 1, averageBuyPrice: 50,
    stcg: { balance: 1, gain: stcgGain },
    ltcg: { balance: 0, gain: ltcgGain },
  }
}

describe('computeAfterGains', () => {
  it('returns base gains when no holdings selected', () => {
    const result = computeAfterGains(baseGains, [])
    expect(result.gains.stcg.profits).toBe(100)
    expect(result.gains.stcg.losses).toBe(500)
    expect(result.gains.ltcg.profits).toBe(1200)
    expect(result.gains.ltcg.losses).toBe(100)
    expect(result.realised).toBe(-400 + 1100) // -400 + 1100 = 700
  })

  it('adds positive stcg gain to stcg profits', () => {
    const result = computeAfterGains(baseGains, [makeHolding(500, 0)])
    expect(result.gains.stcg.profits).toBe(600)
    expect(result.gains.stcg.losses).toBe(500)
  })

  it('adds negative stcg gain (abs) to stcg losses', () => {
    const result = computeAfterGains(baseGains, [makeHolding(-1000, 0)])
    expect(result.gains.stcg.profits).toBe(100)
    expect(result.gains.stcg.losses).toBe(1500)
  })

  it('adds positive ltcg gain to ltcg profits', () => {
    const result = computeAfterGains(baseGains, [makeHolding(0, 200)])
    expect(result.gains.ltcg.profits).toBe(1400)
    expect(result.gains.ltcg.losses).toBe(100)
  })

  it('adds negative ltcg gain (abs) to ltcg losses', () => {
    const result = computeAfterGains(baseGains, [makeHolding(0, -1000)])
    expect(result.gains.ltcg.profits).toBe(1200)
    expect(result.gains.ltcg.losses).toBe(1100)
  })

  it('matches the spec example: ETH stcg=500 ltcg=-1000', () => {
    const result = computeAfterGains(baseGains, [makeHolding(500, -1000)])
    expect(result.gains.stcg.profits).toBe(600)
    expect(result.gains.stcg.losses).toBe(500)
    expect(result.gains.ltcg.profits).toBe(1200)
    expect(result.gains.ltcg.losses).toBe(1100)
    expect(result.netSTCG).toBe(100)
    expect(result.netLTCG).toBe(100)
    expect(result.realised).toBe(200)
  })

  it('does not add zero gains to either profits or losses', () => {
    const result = computeAfterGains(baseGains, [makeHolding(0, 0)])
    expect(result.gains.stcg.profits).toBe(100)
    expect(result.gains.stcg.losses).toBe(500)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: FAIL — `computeAfterGains` is not defined.

- [ ] **Step 3: Implement `src/hooks/useHarvestCalc.ts`**

```ts
import { useMemo } from 'react'
import type { CapitalGains, ComputedGains, Holding } from '../types'
import { useHarvest } from '../context/HarvestContext'

export function computeAfterGains(base: CapitalGains, selected: Holding[]): ComputedGains {
  const gains: CapitalGains = {
    stcg: { profits: base.stcg.profits, losses: base.stcg.losses },
    ltcg: { profits: base.ltcg.profits, losses: base.ltcg.losses },
  }

  for (const h of selected) {
    if (h.stcg.gain > 0) gains.stcg.profits += h.stcg.gain
    else if (h.stcg.gain < 0) gains.stcg.losses += Math.abs(h.stcg.gain)

    if (h.ltcg.gain > 0) gains.ltcg.profits += h.ltcg.gain
    else if (h.ltcg.gain < 0) gains.ltcg.losses += Math.abs(h.ltcg.gain)
  }

  const netSTCG = gains.stcg.profits - gains.stcg.losses
  const netLTCG = gains.ltcg.profits - gains.ltcg.losses
  return { gains, netSTCG, netLTCG, realised: netSTCG + netLTCG }
}

export function useHarvestCalc() {
  const { state, holdingKey } = useHarvest()
  const { capitalGains, holdings, selectedKeys } = state

  return useMemo(() => {
    if (!capitalGains) return null

    const baseLTCG = capitalGains.ltcg.profits - capitalGains.ltcg.losses
    const baseSTCG = capitalGains.stcg.profits - capitalGains.stcg.losses
    const before: ComputedGains = {
      gains: capitalGains,
      netSTCG: baseSTCG,
      netLTCG: baseLTCG,
      realised: baseSTCG + baseLTCG,
    }

    const selected = holdings.filter((h) => selectedKeys.has(holdingKey(h)))
    const after = computeAfterGains(capitalGains, selected)

    const savings = before.realised - after.realised
    return { before, after, savings: savings > 0 ? savings : null }
  }, [capitalGains, holdings, selectedKeys, holdingKey])
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/ && git commit -m "feat: add useHarvestCalc hook with unit tests"
```

---

### Task 8: Header Component

**Files:** `src/components/Header.tsx`

- [ ] **Step 1: Create `src/components/Header.tsx`**

```tsx
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-1">
        <span className="font-black text-xl text-gray-900">KoinX</span>
        <span className="text-yellow-400 text-lg">★</span>
      </div>
      <div className="w-px h-5 bg-gray-200" />
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800 text-sm">Tax Harvesting</span>
        <a href="#" className="text-blue-500 text-xs underline">
          How it works?
        </a>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx && git commit -m "feat: add Header component"
```

---

### Task 9: InfoBanner Component

**Files:** `src/components/InfoBanner.tsx`

- [ ] **Step 1: Create `src/components/InfoBanner.tsx`**

```tsx
import { useState } from 'react'

const DISCLAIMERS = [
  'Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.',
  'Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.',
  'Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.',
  'Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.',
  'Only realised losses are considered for harvesting. Unrealised losses in held assets are not counted.',
]

export default function InfoBanner() {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl mx-4 mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
          <span>ⓘ</span>
          <span>Important Notes &amp; Disclaimers</span>
        </div>
        <span className="text-blue-500 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className="px-6 pb-3 space-y-1 list-disc">
          {DISCLAIMERS.map((d) => (
            <li key={d} className="text-xs text-gray-600">
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InfoBanner.tsx && git commit -m "feat: add collapsible InfoBanner component"
```

---

### Task 10: CapitalGainsCard Component

**Files:** `src/components/CapitalGainsCard.tsx`

- [ ] **Step 1: Create `src/components/CapitalGainsCard.tsx`**

```tsx
import type { ComputedGains } from '../types'
import { formatCurrency } from '../utils/format'

interface Props {
  title: string
  computed: ComputedGains
  realisedLabel: string
  variant: 'dark' | 'blue'
  savings?: number | null
}

function GainValue({ value, variant }: { value: number; variant: 'dark' | 'blue' }) {
  const isNeg = value < 0
  const base = variant === 'blue'
    ? isNeg ? 'text-red-300' : 'text-green-300'
    : isNeg ? 'text-red-500' : 'text-green-600'
  return <span className={`font-medium ${base}`}>{formatCurrency(value)}</span>
}

export default function CapitalGainsCard({ title, computed, realisedLabel, variant, savings }: Props) {
  const isDark = variant === 'dark'
  const bg = isDark ? 'bg-white border border-gray-200' : 'bg-blue-600'
  const titleColor = isDark ? 'text-gray-800' : 'text-white'
  const labelColor = isDark ? 'text-gray-500' : 'text-blue-200'
  const headColor = isDark ? 'text-gray-500' : 'text-blue-200'
  const netColor = isDark ? 'text-gray-900' : 'text-white'
  const dividerColor = isDark ? 'border-gray-100' : 'border-blue-500'
  const realisedColor = isDark ? 'text-gray-900' : 'text-white'

  const { gains, netSTCG, netLTCG, realised } = computed

  return (
    <div className={`rounded-2xl p-5 ${bg}`}>
      <p className={`text-sm font-bold mb-4 ${titleColor}`}>{title}</p>

      <table className="w-full text-xs mb-4">
        <thead>
          <tr>
            <th className="text-left pb-2" />
            <th className={`text-right pb-2 font-medium ${headColor}`}>Short-term</th>
            <th className={`text-right pb-2 font-medium ${headColor}`}>Long-term</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`py-1.5 ${labelColor}`}>Profits</td>
            <td className="text-right py-1.5">
              <GainValue value={gains.stcg.profits} variant={variant} />
            </td>
            <td className="text-right py-1.5">
              <GainValue value={gains.ltcg.profits} variant={variant} />
            </td>
          </tr>
          <tr>
            <td className={`py-1.5 ${labelColor}`}>Losses</td>
            <td className="text-right py-1.5">
              <GainValue value={-gains.stcg.losses} variant={variant} />
            </td>
            <td className="text-right py-1.5">
              <GainValue value={-gains.ltcg.losses} variant={variant} />
            </td>
          </tr>
          <tr className={`border-t ${dividerColor}`}>
            <td className={`pt-2 pb-1 font-semibold text-xs ${netColor}`}>Net Capital Gains</td>
            <td className={`text-right pt-2 pb-1 font-bold ${netColor}`}>{formatCurrency(netSTCG)}</td>
            <td className={`text-right pt-2 pb-1 font-bold ${netColor}`}>{formatCurrency(netLTCG)}</td>
          </tr>
        </tbody>
      </table>

      <div className={`border-t ${dividerColor} pt-3 flex items-baseline justify-between gap-2`}>
        <span className={`text-xs font-medium ${labelColor}`}>{realisedLabel}</span>
        <span className={`text-xl font-extrabold ${realised < 0 ? (isDark ? 'text-red-500' : 'text-red-300') : realisedColor}`}>
          {formatCurrency(realised)}
        </span>
      </div>

      {savings != null && savings > 0 && (
        <div className="mt-3 bg-white/15 rounded-lg px-3 py-2 text-xs font-semibold text-white flex items-center gap-2">
          🔥 You are going to save upto {formatCurrency(savings)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CapitalGainsCard.tsx && git commit -m "feat: add CapitalGainsCard component"
```

---

### Task 11: HoldingsRow Component

**Files:** `src/components/HoldingsRow.tsx`

- [ ] **Step 1: Create `src/components/HoldingsRow.tsx`**

```tsx
import { useState } from 'react'
import type { Holding } from '../types'
import { formatCurrency, formatAmount, formatPrice } from '../utils/format'

interface Props {
  holding: Holding
  isSelected: boolean
  onToggle: () => void
}

function GainCell({ gain, balance, coin }: { gain: number; balance: number; coin: string }) {
  if (gain === 0 && balance === 0) {
    return <span className="text-gray-400">—</span>
  }
  const color = gain >= 0 ? 'text-green-600' : 'text-red-500'
  return (
    <div>
      <div className={`font-semibold text-xs ${color}`}>{formatCurrency(gain)}</div>
      <div className="text-gray-400 text-xs">{formatAmount(balance, coin)}</div>
    </div>
  )
}

export default function HoldingsRow({ holding, isSelected, onToggle }: Props) {
  const [imgError, setImgError] = useState(false)
  const totalValue = holding.currentPrice * holding.totalHolding

  return (
    <tr
      className={`border-b border-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
    >
      {/* Asset */}
      <td className="py-3 pl-4 pr-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
          />
          {imgError ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
              {holding.coin.slice(0, 3)}
            </div>
          ) : (
            <img
              src={holding.logo}
              alt={holding.coin}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              onError={() => setImgError(true)}
            />
          )}
          <div className="min-w-0">
            <div className="font-bold text-xs text-gray-900">{holding.coin}</div>
            <div className="text-gray-400 text-xs truncate max-w-[120px]">{holding.coinName}</div>
          </div>
        </div>
      </td>

      {/* Holdings / Avg Buy */}
      <td className="py-3 px-2">
        <div className="text-xs text-gray-800">{formatAmount(holding.totalHolding, holding.coin)}</div>
        <div className="text-xs text-gray-400">{formatPrice(holding.averageBuyPrice)}</div>
      </td>

      {/* Current Price */}
      <td className="py-3 px-2 text-xs text-gray-800">{formatPrice(holding.currentPrice)}</td>

      {/* Short-term gain */}
      <td className="py-3 px-2">
        <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} coin={holding.coin} />
      </td>

      {/* Long-term gain */}
      <td className="py-3 px-2">
        <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} coin={holding.coin} />
      </td>

      {/* Amount to Sell */}
      <td className="py-3 pr-4 pl-2 text-xs font-semibold text-gray-800">
        {isSelected ? formatAmount(holding.totalHolding, holding.coin) : <span className="text-gray-400">—</span>}
      </td>
    </tr>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HoldingsRow.tsx && git commit -m "feat: add HoldingsRow component"
```

---

### Task 12: HoldingsTable Component

**Files:** `src/components/HoldingsTable.tsx`

- [ ] **Step 1: Create `src/components/HoldingsTable.tsx`**

```tsx
import { useMemo } from 'react'
import type { Holding } from '../types'
import { useHarvest } from '../context/HarvestContext'
import HoldingsRow from './HoldingsRow'

const DEFAULT_VISIBLE = 5

function sortHoldings(holdings: Holding[]): Holding[] {
  return [...holdings].sort(
    (a, b) =>
      Math.abs(b.stcg.gain) + Math.abs(b.ltcg.gain) -
      (Math.abs(a.stcg.gain) + Math.abs(a.ltcg.gain))
  )
}

export default function HoldingsTable() {
  const { state, dispatch, holdingKey } = useHarvest()
  const { holdings, selectedKeys, showAll } = state

  const sorted = useMemo(() => sortHoldings(holdings), [holdings])
  const visible = showAll ? sorted : sorted.slice(0, DEFAULT_VISIBLE)
  const allKeys = useMemo(() => sorted.map(holdingKey), [sorted, holdingKey])

  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.has(k))
  const someSelected = allKeys.some((k) => selectedKeys.has(k))

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-base font-bold text-gray-900">Holdings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-y border-gray-100">
            <tr>
              <th className="py-2.5 pl-4 pr-2 text-left">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected
                    }}
                    onChange={() => dispatch({ type: 'TOGGLE_ALL', allKeys })}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-gray-500">Asset</span>
                </div>
              </th>
              <th className="py-2.5 px-2 text-left text-xs font-medium text-gray-500">
                Holdings<br />
                <span className="font-normal text-gray-400">Avg Buy Price</span>
              </th>
              <th className="py-2.5 px-2 text-left text-xs font-medium text-gray-500">Current Price</th>
              <th className="py-2.5 px-2 text-left text-xs font-medium text-gray-500">Short-term</th>
              <th className="py-2.5 px-2 text-left text-xs font-medium text-gray-500">Long-term</th>
              <th className="py-2.5 pr-4 pl-2 text-left text-xs font-medium text-gray-500">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((h) => {
              const key = holdingKey(h)
              return (
                <HoldingsRow
                  key={key}
                  holding={h}
                  isSelected={selectedKeys.has(key)}
                  onToggle={() => dispatch({ type: 'TOGGLE_COIN', key })}
                />
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 text-center">
        <button
          onClick={() => dispatch({ type: 'SET_SHOW_ALL', value: !showAll })}
          className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
        >
          {showAll ? 'Show less ▲' : `View all (${holdings.length}) ▼`}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HoldingsTable.tsx && git commit -m "feat: add HoldingsTable with select-all and view-all"
```

---

### Task 13: App.tsx — Wire Everything Together

**Files:** `src/App.tsx` (replace placeholder)

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { useEffect } from 'react'
import { HarvestProvider, useHarvest } from './context/HarvestContext'
import { fetchHoldings } from './api/holdings'
import { fetchCapitalGains } from './api/capitalGains'
import { useHarvestCalc } from './hooks/useHarvestCalc'
import Header from './components/Header'
import InfoBanner from './components/InfoBanner'
import CapitalGainsCard from './components/CapitalGainsCard'
import HoldingsTable from './components/HoldingsTable'

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/2" />
    </div>
  )
}

function Dashboard() {
  const { state, dispatch } = useHarvest()
  const { loading, error } = state
  const calc = useHarvestCalc()

  useEffect(() => {
    Promise.all([fetchHoldings(), fetchCapitalGains()])
      .then(([holdings, capitalGains]) => dispatch({ type: 'SET_DATA', holdings, capitalGains }))
      .catch((e: unknown) =>
        dispatch({ type: 'SET_ERROR', error: e instanceof Error ? e.message : 'Failed to load data' })
      )
  }, [dispatch])

  return (
    <div className="max-w-5xl mx-auto px-4 pb-8">
      <InfoBanner />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {loading || !calc ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : error ? (
          <div className="col-span-2 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center justify-between">
            <span>⚠ {error}</span>
            <button
              className="ml-4 text-xs font-semibold underline"
              onClick={() => {
                dispatch({ type: 'SET_DATA', holdings: [], capitalGains: { stcg: { profits: 0, losses: 0 }, ltcg: { profits: 0, losses: 0 } } })
                Promise.all([fetchHoldings(), fetchCapitalGains()])
                  .then(([h, cg]) => dispatch({ type: 'SET_DATA', holdings: h, capitalGains: cg }))
                  .catch((e: unknown) => dispatch({ type: 'SET_ERROR', error: e instanceof Error ? e.message : 'Failed to load data' }))
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <CapitalGainsCard
              title="Pre Harvesting"
              computed={calc.before}
              realisedLabel="Realised Capital Gains:"
              variant="dark"
            />
            <CapitalGainsCard
              title="After Harvesting"
              computed={calc.after}
              realisedLabel="Effective Capital Gains:"
              variant="blue"
              savings={calc.savings}
            />
          </>
        )}
      </div>

      {!error && <HoldingsTable />}
    </div>
  )
}

export default function App() {
  return (
    <HarvestProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Dashboard />
      </div>
    </HarvestProvider>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run dev server and verify full UI**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify:
- Header renders with KoinX logo
- InfoBanner shows disclaimers (collapsible)
- After ~200ms, both cards populate with data
- Holdings table shows 5 rows sorted by highest gain
- Checking a row updates the "After Harvesting" card in real time
- Selecting a row fills "Amount to Sell" column
- Select-all checkbox works
- "View all" expands to all 25 rows

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx && git commit -m "feat: wire all components into App with data fetching and Provider"
```

---

### Task 14: Skeleton Loading for Holdings Table

**Files:** `src/components/HoldingsTable.tsx` (modify to show skeletons when loading)

- [ ] **Step 1: Add skeleton rows when `loading` is true in HoldingsTable**

Replace the `<tbody>` block in `HoldingsTable.tsx` with:

```tsx
<tbody>
  {state.loading
    ? Array.from({ length: DEFAULT_VISIBLE }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50 animate-pulse">
          {Array.from({ length: 6 }).map((_, j) => (
            <td key={j} className="py-4 px-2">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))
    : visible.map((h) => {
        const key = holdingKey(h)
        return (
          <HoldingsRow
            key={key}
            holding={h}
            isSelected={selectedKeys.has(key)}
            onToggle={() => dispatch({ type: 'TOGGLE_COIN', key })}
          />
        )
      })}
</tbody>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HoldingsTable.tsx && git commit -m "feat: add skeleton loading state to HoldingsTable"
```

---

### Task 15: Final Polish & Build Check

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: `dist/` folder created, no TypeScript or Vite errors.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4173`. Verify the full app works identically to dev.

- [ ] **Step 4: Verify mobile layout**

In browser DevTools, toggle mobile viewport (375px width). Verify:
- Cards stack vertically
- Table scrolls horizontally
- All text is readable

- [ ] **Step 5: Add `.gitignore`**

```
node_modules/
dist/
.superpowers/
```

- [ ] **Step 6: Final commit**

```bash
git add .gitignore && git commit -m "chore: add .gitignore"
git tag v1.0.0 -m "Initial release: Tax Loss Harvesting interface"
```
