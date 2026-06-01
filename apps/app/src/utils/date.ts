export function startOfDay(d: Date)  { const r = new Date(d); r.setHours(0, 0, 0, 0); return r }
export function endOfDay(d: Date)    { const r = new Date(d); r.setHours(23, 59, 59, 999); return r }
export function addDays(d: Date, n: number)   { const r = new Date(d); r.setDate(r.getDate() + n); return r }
export function addMonths(d: Date, n: number) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r }
export function addYears(d: Date, n: number)  { const r = new Date(d); r.setFullYear(r.getFullYear() + n); return r }

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}
export function isSameYear(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
}
