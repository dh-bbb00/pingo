import React, { useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useStatsByCategory, useStatsByDate, useStatsByMonth } from '@/hooks/queries/useStatsData'
import { useCategoriesAll } from '@/hooks/queries/useCategoriesAll'
import { getDateRange, getPrevDate, buildMonthlyBarData, buildYearlyBarData } from '../utils'
import type { StatsDateTab } from '../types'
import SummaryCard from './SummaryCard'
import TrendBarChart from './TrendBarChart'
import { strings } from '@/constants/strings'
import { useTheme } from '@/theme'

const s = strings.stats

interface Props {
  dateTab:             StatsDateTab
  date:                Date
  selectedCategoryId:  string | null
  onSelectCategory:    (id: string | null) => void
}

export default function CategoryTab({ dateTab, date, selectedCategoryId, onSelectCategory }: Props) {
  const { theme } = useTheme()
  const { data: categories = [] } = useCategoriesAll()

  const range     = useMemo(() => selectedCategoryId ? getDateRange(dateTab, date) : null, [dateTab, date, selectedCategoryId])
  const prevRange = useMemo(() => selectedCategoryId ? getDateRange(dateTab, getPrevDate(dateTab, date)) : null, [dateTab, date, selectedCategoryId])

  const params     = useMemo(() => range     ? { ...range,     categoryId: selectedCategoryId! } : null, [range,     selectedCategoryId])
  const prevParams = useMemo(() => prevRange ? { ...prevRange, categoryId: selectedCategoryId! } : null, [prevRange, selectedCategoryId])

  const { data: catData,     isLoading: catLoading  } = useStatsByCategory(params)
  const { data: prevCatData }                         = useStatsByCategory(prevParams)
  const { data: byDateData,  isLoading: dateLoading  } = useStatsByDate(dateTab === '월' && params ? params : null)
  const { data: byMonthData, isLoading: monthLoading } = useStatsByMonth(dateTab === '년' && params ? params : null)

  const chartLoading =
    (dateTab === '월' && dateLoading) ||
    (dateTab === '년' && monthLoading)

  const barData = useMemo(() => {
    if (dateTab === '월' && byDateData) return buildMonthlyBarData(byDateData, date.getFullYear(), date.getMonth())
    if (dateTab === '년' && byMonthData) return buildYearlyBarData(byMonthData)
    return null
  }, [dateTab, date, byDateData, byMonthData])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
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
            isLoading={catLoading}
          />
          {(dateTab === '월' || dateTab === '년') && (
            <TrendBarChart
              data={barData ?? []}
              isLoading={chartLoading}
              title={s.trendTitle}
            />
          )}
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
