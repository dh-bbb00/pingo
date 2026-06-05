import type { StatsDateTab } from './types'

export interface DateRange {
  startDate: string
  endDate:   string
}

/** 선택된 날짜 탭 기준으로 시작/종료 ISO 문자열 반환 */
export function getDateRange(dateTab: StatsDateTab, date: Date): DateRange {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()

  if (dateTab === '일') {
    return {
      startDate: new Date(y, m, d, 0, 0, 0, 0).toISOString(),
      endDate:   new Date(y, m, d, 23, 59, 59, 999).toISOString(),
    }
  }
  if (dateTab === '월') {
    return {
      startDate: new Date(y, m, 1).toISOString(),
      endDate:   new Date(y, m + 1, 0, 23, 59, 59, 999).toISOString(),
    }
  }
  // 년
  return {
    startDate: new Date(y, 0, 1).toISOString(),
    endDate:   new Date(y, 11, 31, 23, 59, 59, 999).toISOString(),
  }
}

/** 이전 기간의 날짜 반환 */
export function getPrevDate(dateTab: StatsDateTab, date: Date): Date {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  if (dateTab === '일') return new Date(y, m, d - 1)
  if (dateTab === '월') return new Date(y, m - 1, 1)
  return new Date(y - 1, m, d)
}

/** 날짜 표시 문자열 */
export function formatDateLabel(dateTab: StatsDateTab, date: Date): string {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  if (dateTab === '일') return `${y}년 ${m}월 ${d}일`
  if (dateTab === '월') return `${y}년 ${m}월`
  return `${y}년`
}

/** 월별 BarChart 데이터 빌드 (missing day → 0) */
export function buildMonthlyBarData(
  byDate: { date: string; amount: number }[],
  year: number,
  month: number, // 0-based
): { value: number; label: string }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const map: Record<number, number> = {}
  for (const item of byDate) {
    const day = new Date(item.date).getDate()
    map[day] = item.amount
  }
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    return {
      value: map[day] ?? 0,
      label: day === 1 || day % 10 === 0 || day === daysInMonth ? String(day) : '',
    }
  })
}

/** 연별 BarChart 데이터 빌드 (missing month → 0) */
export function buildYearlyBarData(
  byMonth: { month: string; amount: number }[],
): { value: number; label: string }[] {
  const map: Record<number, number> = {}
  for (const item of byMonth) {
    const mo = new Date(item.month).getMonth() + 1
    map[mo] = item.amount
  }
  return Array.from({ length: 12 }, (_, i) => {
    const mo = i + 1
    return {
      value: map[mo] ?? 0,
      label: `${mo}월`,
    }
  })
}
