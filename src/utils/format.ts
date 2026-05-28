export function formatCurrency(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  if (abs === 0) return '₹0.00'
  if (abs < 0.01) return `${sign}₹${abs.toExponential(2)}`
  return `${sign}₹${abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatAmount(value: number, coin: string): string {
  const abs = Math.abs(value)
  if (abs === 0) return `0 ${coin}`
  if (abs < 1e-8) return `~0 ${coin}`
  if (abs < 0.0001) return `${abs.toExponential(3)} ${coin}`
  return `${abs.toLocaleString('en-IN', { maximumFractionDigits: 6 })} ${coin}`
}

export function formatPrice(value: number): string {
  if (value === 0) return '₹0'
  if (value < 0.001) return `₹${value.toExponential(3)}`
  if (value >= 1000) return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
}
