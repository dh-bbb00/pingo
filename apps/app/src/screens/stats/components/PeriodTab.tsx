import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useStatsByCategory, useStatsByDate, useStatsByMonth, useStatsByHour, useStatsTop10 } from '@/hooks/queries/useStatsData'
import { getDateRange, getCustomDateRange, getPrevCustomDateRange, getPrevDate, buildMonthlyBarData, buildYearlyBarData, buildHourlyBarData, buildRangeBarData } from '../utils'
import { DATE_TAB } from '../types'
import type { StatsDateTab } from '../types'
import SummaryCard from './SummaryCard'
import TrendBarChart from '@/components/charts/TrendBarChart'
import CategoryBreakdown from '@/components/charts/CategoryBreakdown'
import TopTransactionList from './TopTransactionList'
import { strings } from '@/constants/strings'

const s = strings.stats

interface Props {
  dateTab:       StatsDateTab
  date:          Date
  rangeStart:    Date
  rangeEnd:      Date
  refreshControl?: React.ReactElement<any>
}

export default function PeriodTab({ dateTab, date, rangeStart, rangeEnd, refreshControl }: Props) {
  const isRange = dateTab === DATE_TAB.RANGE

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
  const { data: byHourData,  isLoading: hourLoading  } = useStatsByHour(dateTab === DATE_TAB.DAY ? range : null)
  const { data: byDateData,  isLoading: dateLoading  } = useStatsByDate((dateTab === DATE_TAB.MONTH || dateTab === DATE_TAB.RANGE) ? range : null)
  const { data: byMonthData, isLoading: monthLoading } = useStatsByMonth(dateTab === DATE_TAB.YEAR ? range : null)
  const { data: top10Data,   isLoading: top10Loading  } = useStatsTop10(range)

  const chartLoading =
    (dateTab === DATE_TAB.DAY   && hourLoading)  ||
    (dateTab === DATE_TAB.MONTH && dateLoading)  ||
    (dateTab === DATE_TAB.YEAR  && monthLoading) ||
    (dateTab === DATE_TAB.RANGE && dateLoading)

  const barData = useMemo(() => {
    if (dateTab === DATE_TAB.DAY   && byHourData)  return buildHourlyBarData(byHourData)
    if (dateTab === DATE_TAB.MONTH && byDateData)  return buildMonthlyBarData(byDateData, date.getFullYear(), date.getMonth())
    if (dateTab === DATE_TAB.YEAR  && byMonthData) return buildYearlyBarData(byMonthData)
    if (dateTab === DATE_TAB.RANGE && byDateData)  return buildRangeBarData(byDateData, rangeStart, rangeEnd)
    return null
  }, [dateTab, date, rangeStart, rangeEnd, byHourData, byDateData, byMonthData])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12, paddingBottom: 40 }} refreshControl={refreshControl}>
      <SummaryCard
        total={catData?.total ?? 0}
        prevTotal={prevCatData?.total ?? 0}
        dateTab={dateTab}
        isLoading={catLoading}
      />

      <CategoryBreakdown
        total={catData?.total ?? 0}
        byCategory={catData?.byCategory ?? []}
        prevByCategory={prevCatData?.byCategory}
        dateTab={dateTab}
        title={s.categoryBreakdown}
        isLoading={catLoading}
      />

      <TrendBarChart
        data={barData ?? []}
        isLoading={chartLoading}
        title={s.trendTitle}
      />

      <TopTransactionList
        items={top10Data ?? []}
        isLoading={top10Loading}
      />
    </ScrollView>
  )
}
