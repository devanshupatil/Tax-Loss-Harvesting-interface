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
