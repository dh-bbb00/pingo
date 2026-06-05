import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useStatsByCategory, useStatsByDate, useStatsByMonth, useStatsByHour } from '@/hooks/queries/useStatsData'
import { getDateRange, getCustomDateRange, getPrevCustomDateRange, getPrevDate, buildMonthlyBarData, buildYearlyBarData, buildHourlyBarData, buildRangeBarData } from '../utils'
import type { StatsDateTab } from '../types'
import SummaryCard from './SummaryCard'
import TrendBarChart from './TrendBarChart'
import CategoryBreakdown from './CategoryBreakdown'
import { strings } from '@/constants/strings'

const s = strings.stats

interface Props {
  dateTab:    StatsDateTab
  date:       Date
  rangeStart: Date
  rangeEnd:   Date
}

export default function PeriodTab({ dateTab, date, rangeStart, rangeEnd }: Props) {
  const isRange = dateTab === '기간'

  const range     = useMemo(
    () => isRange ? getCustomDateRange(rangeStart, rangeEnd) : getDateRange(dateTab, date),
    [isRange, dateTab, date, rangeStart, rangeEnd],
  )
  const prevRange = useMemo(
    () => isRange
      ? getPrevCustomDateRange(rangeStart, rangeEnd)
      : getDateRange(dateTab, getPrevDate(dateTab, date)),
    [isRange, dateTab, date, rangeStart, rangeEnd],
  )

  const { data: catData,     isLoading: catLoading  } = useStatsByCategory(range)
  const { data: prevCatData }                         = useStatsByCategory(prevRange)
  const { data: byHourData,  isLoading: hourLoading  } = useStatsByHour(dateTab === '일' ? range : null)
  const { data: byDateData,  isLoading: dateLoading  } = useStatsByDate((dateTab === '월' || dateTab === '기간') ? range : null)
  const { data: byMonthData, isLoading: monthLoading } = useStatsByMonth(dateTab === '년' ? range : null)

  const chartLoading =
    (dateTab === '일' && hourLoading)  ||
    (dateTab === '월' && dateLoading)  ||
    (dateTab === '년' && monthLoading) ||
    (dateTab === '기간' && dateLoading)

  const barData = useMemo(() => {
    if (dateTab === '일' && byHourData) {
      return buildHourlyBarData(byHourData)
    }
    if (dateTab === '월' && byDateData) {
      return buildMonthlyBarData(byDateData, date.getFullYear(), date.getMonth())
    }
    if (dateTab === '년' && byMonthData) {
      return buildYearlyBarData(byMonthData)
    }
    if (dateTab === '기간' && byDateData) {
      return buildRangeBarData(byDateData, rangeStart, rangeEnd)
    }
    return null
  }, [dateTab, date, rangeStart, rangeEnd, byHourData, byDateData, byMonthData])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12, paddingBottom: 40 }}>
      <SummaryCard
        total={catData?.total ?? 0}
        prevTotal={prevCatData?.total ?? 0}
        dateTab={dateTab}
        isLoading={catLoading}
      />

      <TrendBarChart
        data={barData ?? []}
        isLoading={chartLoading}
        title={s.trendTitle}
      />

      <CategoryBreakdown
        total={catData?.total ?? 0}
        byCategory={catData?.byCategory ?? []}
        title={s.categoryBreakdown}
        isLoading={catLoading}
      />
    </ScrollView>
  )
}
