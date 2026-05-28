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
  | { type: 'SET_LOADING' }
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
    case 'SET_LOADING':
      return { ...state, loading: true, error: null }
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
