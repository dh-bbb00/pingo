import React, { useMemo, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useStatsByCategory, useStatsByDate, useStatsByMonth, useStatsTop10 } from '@/hooks/queries/useStatsData'
import { useCategoriesAll } from '@/hooks/queries/useCategoriesAll'
import { getDateRange, getPrevDate, buildMonthlyBarData, buildYearlyBarData } from '../utils'
import { DATE_TAB } from '@/api/endpoints/stats.api'
import type { StatsDateTab } from '@/api/endpoints/stats.api'
import SummaryCard from './SummaryCard'
import MonthlyComparisonCard from './MonthlyComparisonCard'
import TrendBarChart from '@/components/charts/TrendBarChart'
import TopTransactionList from './TopTransactionList'
import { strings } from '@/constants/strings'
import { useTheme } from '@/theme'

const s = strings.stats

const UNCATEGORIZED_ID = 'uncategorized'

interface Props {
  dateTab:             StatsDateTab
  date:                Date
  selectedCategoryId:  string | null
  onSelectCategory:    (id: string | null) => void
  refreshControl?:     React.ReactElement<any>
}

export default function CategoryTab({ dateTab, date, selectedCategoryId, onSelectCategory, refreshControl }: Props) {
  const { theme } = useTheme()
  const { data: categories = [] } = useCategoriesAll()

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      onSelectCategory(categories[0].id)
    }
  }, [categories]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedCategory = useMemo(
    () => categories.find(c => c.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  )
  // 일/월 탭에서만 예산 진행률 표시 (예산은 월 단위 개념)
  const budgetForTab = (dateTab === DATE_TAB.DAY || dateTab === DATE_TAB.MONTH)
    ? (selectedCategory?.budget ?? null)
    : null

  const range     = useMemo(() => selectedCategoryId ? getDateRange(dateTab, date) : null, [dateTab, date, selectedCategoryId])
  const prevRange = useMemo(() => selectedCategoryId ? getDateRange(dateTab, getPrevDate(dateTab, date)) : null, [dateTab, date, selectedCategoryId])

  const params     = useMemo(() => range     ? { ...range,     categoryId: selectedCategoryId! } : null, [range,     selectedCategoryId])
  const prevParams = useMemo(() => prevRange ? { ...prevRange, categoryId: selectedCategoryId! } : null, [prevRange, selectedCategoryId])

  // 월 탭: 최근 4개월 범위 (3개 표시 + 이전 달 비교 기준)
  const recentMonthsParams = useMemo(() => {
    if (dateTab !== DATE_TAB.MONTH || !selectedCategoryId) return null
    const y = date.getFullYear()
    const m = date.getMonth()
    return {
      startDate:  new Date(y, m - 3, 1).toISOString(),
      endDate:    new Date(y, m + 1, 0, 23, 59, 59, 999).toISOString(),
      categoryId: selectedCategoryId,
    }
  }, [dateTab, date, selectedCategoryId])

  const { data: catData,          isLoading: catLoading     } = useStatsByCategory(params)
  const { data: prevCatData }                                  = useStatsByCategory(prevParams)
  const { data: byDateData,       isLoading: dateLoading     } = useStatsByDate(dateTab === DATE_TAB.MONTH && params ? params : null)
  const { data: byMonthData,      isLoading: monthLoading    } = useStatsByMonth(dateTab === DATE_TAB.YEAR  && params ? params : null)
  const { data: recentMonthsData = [], isLoading: recentMonthsLoading } = useStatsByMonth(recentMonthsParams)
  const { data: top10Data,        isLoading: top10Loading    } = useStatsTop10(params)

  const chartLoading =
    (dateTab === DATE_TAB.MONTH && dateLoading) ||
    (dateTab === DATE_TAB.YEAR  && monthLoading)

  const barData = useMemo(() => {
    if (dateTab === DATE_TAB.MONTH && byDateData)  return buildMonthlyBarData(byDateData, date.getFullYear(), date.getMonth())
    if (dateTab === DATE_TAB.YEAR  && byMonthData) return buildYearlyBarData(byMonthData)
    return null
  }, [dateTab, date, byDateData, byMonthData])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} refreshControl={refreshControl}>
      {/* 카테고리 선택 칩 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ss.chipList}>
        {categories.map(cat => {
          const active = selectedCategoryId === cat.id
          return (
            <TouchableOpacity
              key={cat.id}
              style={[ss.chip, { backgroundColor: active ? cat.color : theme.colors.surfaceVariant }]}
              onPress={() => onSelectCategory(active ? null : cat.id)}
              activeOpacity={0.7}
            >
              <Text style={ss.chipIcon}>{cat.icon}</Text>
              <Text style={[ss.chipText, { color: active ? '#fff' : theme.colors.text.primary }]} numberOfLines={1}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          )
        })}
        {/* 기타 칩 — 카테고리 미지정 거래 모아보기 */}
        <TouchableOpacity
          key={UNCATEGORIZED_ID}
          style={[ss.chip, {
            backgroundColor: selectedCategoryId === UNCATEGORIZED_ID
              ? theme.colors.text.secondary
              : theme.colors.surfaceVariant,
          }]}
          onPress={() => onSelectCategory(selectedCategoryId === UNCATEGORIZED_ID ? null : UNCATEGORIZED_ID)}
          activeOpacity={0.7}
        >
          <Text style={[ss.chipText, {
            color: selectedCategoryId === UNCATEGORIZED_ID ? '#fff' : theme.colors.text.secondary,
          }]} numberOfLines={1}>
            {s.other}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {!selectedCategoryId ? (
        <View style={ss.emptyWrap}>
          <Text style={[ss.emptyText, { color: theme.colors.text.disabled }]}>{s.selectCategory}</Text>
        </View>
      ) : (
        <View style={{ paddingTop: 12 }}>
          <SummaryCard
            total={catData?.total ?? 0}
            prevTotal={prevCatData?.total ?? 0}
            dateTab={dateTab}
            budget={budgetForTab}
            isLoading={catLoading}
          />
          {dateTab === DATE_TAB.MONTH && (
            <MonthlyComparisonCard data={recentMonthsData} isLoading={recentMonthsLoading} />
          )}
          {(dateTab === DATE_TAB.MONTH || dateTab === DATE_TAB.YEAR) && (
            <TrendBarChart
              data={barData ?? []}
              isLoading={chartLoading}
              title={s.trendTitle}
            />
          )}
          <TopTransactionList
            items={top10Data ?? []}
            isLoading={top10Loading}
          />
        </View>
      )}
    </ScrollView>
  )
}

const ss = StyleSheet.create({
  chipList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  chipIcon: { fontSize: 14 },
  chipText: { fontSize: 13, fontWeight: '500', maxWidth: 80 },
  emptyWrap:{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText:{ fontSize: 14 },
})
