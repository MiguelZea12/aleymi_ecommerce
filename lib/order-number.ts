/** Formato: 0001-0001-000000042 */
export function formatOrderNumber(seq: number): string {
  const store = "0001"
  const terminal = "0001"
  const serial = String(seq).padStart(9, "0")
  return `${store}-${terminal}-${serial}`
}
