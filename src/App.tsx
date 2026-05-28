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
