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
