import type { CapitalGains } from '../types'

const DATA: CapitalGains = {
  stcg: { profits: 70200.88, losses: 1548.53 },
  ltcg: { profits: 5020, losses: 3050 },
}

export function fetchCapitalGains(): Promise<CapitalGains> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(DATA)), 200))
}
