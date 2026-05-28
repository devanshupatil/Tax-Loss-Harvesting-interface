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
