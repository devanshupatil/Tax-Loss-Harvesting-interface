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
