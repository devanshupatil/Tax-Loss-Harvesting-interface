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
