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

/**
 * 토큰 기반 날짜 포맷팅 — Date 또는 ISO 문자열 모두 수용
 * 지원 토큰: yyyy · MM(2자리) · M(1-2자리) · dd(2자리) · d(1-2자리) · HH · mm
 */
export function formatDate(value: Date | string, pattern: string): string {
  const d = typeof value === 'string' ? new Date(value) : value
  return pattern
    .replace('yyyy', String(d.getFullYear()))
    .replace('MM',   String(d.getMonth() + 1).padStart(2, '0'))
    .replace('M',    String(d.getMonth() + 1))
    .replace('dd',   String(d.getDate()).padStart(2, '0'))
    .replace('d',    String(d.getDate()))
    .replace('HH',   String(d.getHours()).padStart(2, '0'))
    .replace('mm',   String(d.getMinutes()).padStart(2, '0'))
}
