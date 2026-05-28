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
