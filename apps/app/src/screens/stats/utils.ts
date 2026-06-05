import { DATE_TAB } from './types'
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

  if (dateTab === DATE_TAB.DAY) {
    return {
      startDate: new Date(y, m, d, 0, 0, 0, 0).toISOString(),
      endDate:   new Date(y, m, d, 23, 59, 59, 999).toISOString(),
    }
  }
  if (dateTab === DATE_TAB.MONTH) {
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

/** 커스텀 기간 범위를 DateRange 로 변환 */
export function getCustomDateRange(start: Date, end: Date): DateRange {
  const s = new Date(start)
  s.setHours(0, 0, 0, 0)
  const e = new Date(end)
  e.setHours(23, 59, 59, 999)
  return { startDate: s.toISOString(), endDate: e.toISOString() }
}

/** 커스텀 기간의 직전 동일 길이 구간 반환 */
export function getPrevCustomDateRange(start: Date, end: Date): DateRange {
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDay   = new Date(end.getFullYear(),   end.getMonth(),   end.getDate())
  const durationDays = Math.round((endDay.getTime() - startDay.getTime()) / 86_400_000) + 1

  const prevEndDay   = new Date(startDay.getTime() - 86_400_000)
  const prevStartDay = new Date(prevEndDay.getTime() - (durationDays - 1) * 86_400_000)

  return {
    startDate: new Date(prevStartDay.getFullYear(), prevStartDay.getMonth(), prevStartDay.getDate(), 0, 0, 0, 0).toISOString(),
    endDate:   new Date(prevEndDay.getFullYear(),   prevEndDay.getMonth(),   prevEndDay.getDate(),   23, 59, 59, 999).toISOString(),
  }
}

/** 이전 기간의 날짜 반환 */
export function getPrevDate(dateTab: StatsDateTab, date: Date): Date {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  if (dateTab === DATE_TAB.DAY)   return new Date(y, m, d - 1)
  if (dateTab === DATE_TAB.MONTH) return new Date(y, m - 1, 1)
  return new Date(y - 1, m, d)
}

/** 날짜 표시 문자열 */
export function formatDateLabel(dateTab: StatsDateTab, date: Date): string {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  if (dateTab === DATE_TAB.DAY)   return `${y}년 ${m}월 ${d}일`
  if (dateTab === DATE_TAB.MONTH) return `${y}년 ${m}월`
  return `${y}년`
}

/** 기간 탭용 일별 BarChart 데이터 빌드 (start~end 범위) */
export function buildRangeBarData(
  byDate: { date: string; amount: number }[],
  start:  Date,
  end:    Date,
): { value: number; label: string; tooltipLabel: string }[] {
  const map: Record<string, number> = {}
  for (const item of byDate) {
    const d   = new Date(item.date)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    map[key] = item.amount
  }

  const result: { value: number; label: string; tooltipLabel: string }[] = []
  const cur      = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDay   = new Date(end.getFullYear(),   end.getMonth(),   end.getDate())
  const totalDays = Math.round((endDay.getTime() - cur.getTime()) / 86_400_000) + 1
  const labelStep = totalDays > 30 ? 7 : 5

  let idx = 0
  while (cur <= endDay) {
    const key  = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`
    const m    = cur.getMonth() + 1
    const d    = cur.getDate()
    const show = idx === 0 || idx % labelStep === 0 || idx === totalDays - 1
    result.push({
      value:        map[key] ?? 0,
      label:        show ? `${m}/${d}` : '',
      tooltipLabel: `${m}/${d}`,
    })
    cur.setDate(cur.getDate() + 1)
    idx++
  }

  return result
}

/** 시간대별 BarChart 데이터 빌드 (0~23시, missing hour → 0) */
export function buildHourlyBarData(
  byHour: { hour: number; amount: number }[],
): { value: number; label: string; tooltipLabel: string }[] {
  const map: Record<number, number> = {}
  for (const item of byHour) {
    map[item.hour] = item.amount
  }
  return Array.from({ length: 24 }, (_, hour) => ({
    value:        map[hour] ?? 0,
    label:        hour === 0 || hour % 6 === 0 ? String(hour) : '',
    tooltipLabel: `${hour}시`,
  }))
}

/** 월별 BarChart 데이터 빌드 (missing day → 0) */
export function buildMonthlyBarData(
  byDate: { date: string; amount: number }[],
  year: number,
  month: number, // 0-based
): { value: number; label: string; tooltipLabel: string }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const map: Record<number, number> = {}
  for (const item of byDate) {
    const day = new Date(item.date).getDate()
    map[day] = item.amount
  }
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    return {
      value:        map[day] ?? 0,
      label:        day === 1 || day % 10 === 0 || day === daysInMonth ? String(day) : '',
      tooltipLabel: `${month + 1}/${day}`,
    }
  })
}

/** 연별 BarChart 데이터 빌드 (missing month → 0) */
export function buildYearlyBarData(
  byMonth: { month: string; amount: number }[],
): { value: number; label: string; tooltipLabel: string }[] {
  const map: Record<number, number> = {}
  for (const item of byMonth) {
    const mo = new Date(item.month).getMonth() + 1
    map[mo] = item.amount
  }
  return Array.from({ length: 12 }, (_, i) => {
    const mo = i + 1
    return {
      value:        map[mo] ?? 0,
      label:        `${mo}월`,
      tooltipLabel: `${mo}월`,
    }
  })
}
