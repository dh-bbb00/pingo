import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useStatsByCategory, useStatsByDate, useStatsByMonth } from '@/hooks/queries/useStatsData'
import { getDateRange, getPrevDate, buildMonthlyBarData, buildYearlyBarData } from '../utils'
import type { StatsDateTab } from '../types'
import SummaryCard from './SummaryCard'
import TrendBarChart from './TrendBarChart'
import CategoryBreakdown from './CategoryBreakdown'
import { strings } from '@/constants/strings'

const s = strings.stats

interface Props {
  dateTab: StatsDateTab
  date:    Date
}

export default function PeriodTab({ dateTab, date }: Props) {
  const range     = useMemo(() => getDateRange(dateTab, date), [dateTab, date])
  const prevRange = useMemo(() => getDateRange(dateTab, getPrevDate(dateTab, date)), [dateTab, date])

  const { data: catData }     = useStatsByCategory(range)
  const { data: prevCatData } = useStatsByCategory(prevRange)
  const { data: byDateData }  = useStatsByDate(dateTab === '월' ? range : null)
  const { data: byMonthData } = useStatsByMonth(dateTab === '년' ? range : null)

  const barData = useMemo(() => {
    if (dateTab === '월' && byDateData) {
      return buildMonthlyBarData(byDateData, date.getFullYear(), date.getMonth())
    }
    if (dateTab === '년' && byMonthData) {
      return buildYearlyBarData(byMonthData)
    }
    return null
  }, [dateTab, date, byDateData, byMonthData])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12, paddingBottom: 40 }}>
      <SummaryCard
        total={catData?.total ?? 0}
        prevTotal={prevCatData?.total ?? 0}
      />

      {barData && (
        <TrendBarChart data={barData} title={s.trendTitle} />
      )}

      <CategoryBreakdown
        total={catData?.total ?? 0}
        byCategory={catData?.byCategory ?? []}
        title={s.categoryBreakdown}
      />
    </ScrollView>
  )
}
