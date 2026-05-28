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
    expect(result.realised).toBe(-400 + 1100) // 700
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
