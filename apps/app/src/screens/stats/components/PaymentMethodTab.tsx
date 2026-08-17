import React, { useMemo, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useStatsByCategory, useStatsByDate, useStatsByMonth, useStatsTop10 } from '@/hooks/queries/useStatsData'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import { getDateRange, getCustomDateRange, getPrevCustomDateRange, getPrevDate, buildMonthlyBarData, buildYearlyBarData } from '../utils'
import { DATE_TAB } from '@/api/endpoints/stats.api'
import type { StatsDateTab } from '@/api/endpoints/stats.api'
import SummaryCard from './SummaryCard'
import TrendBarChart from '@/components/charts/TrendBarChart'
import CategoryBreakdown from '@/components/charts/CategoryBreakdown'
import TopTransactionList from './TopTransactionList'
import { strings } from '@/constants/strings'
import { useTheme } from '@/theme'
import { PAYMENT_METHOD_EMOJI } from '@/constants/emojis'

const s = strings.stats

interface Props {
  dateTab:                 StatsDateTab
  date:                    Date
  rangeStart:              Date
  rangeEnd:                Date
  selectedPaymentMethodId: string | null
  onSelectPaymentMethod:   (id: string | null) => void
  refreshControl?:         React.ReactElement<any>
}

export default function PaymentMethodTab({ dateTab, date, rangeStart, rangeEnd, selectedPaymentMethodId, onSelectPaymentMethod, refreshControl }: Props) {
  const isRange = dateTab === DATE_TAB.RANGE
  const { theme } = useTheme()
  const { data: methods = [] } = usePaymentMethods()

  useEffect(() => {
    if (!selectedPaymentMethodId && methods.length > 0) {
      const defaultMethod = methods.find(m => m.isDefault) ?? methods.find(m => m.type === 'CASH')
      if (defaultMethod) onSelectPaymentMethod(defaultMethod.id)
    }
  }, [methods]) // eslint-disable-line react-hooks/exhaustive-deps

  const range     = useMemo(() => {
    if (!selectedPaymentMethodId) return null
    return isRange ? getCustomDateRange(rangeStart, rangeEnd) : getDateRange(dateTab, date)
  }, [isRange, dateTab, date, rangeStart, rangeEnd, selectedPaymentMethodId])

  const prevRange = useMemo(() => {
    if (!selectedPaymentMethodId) return null
    return isRange ? getPrevCustomDateRange(rangeStart, rangeEnd) : getDateRange(dateTab, getPrevDate(dateTab, date))
  }, [isRange, dateTab, date, rangeStart, rangeEnd, selectedPaymentMethodId])

  const params     = useMemo(() => range     ? { ...range,     paymentMethodId: selectedPaymentMethodId! } : null, [range,     selectedPaymentMethodId])
  const prevParams = useMemo(() => prevRange ? { ...prevRange, paymentMethodId: selectedPaymentMethodId! } : null, [prevRange, selectedPaymentMethodId])

  const { data: catData,     isLoading: catLoading  } = useStatsByCategory(params)
  const { data: prevCatData }                         = useStatsByCategory(prevParams)
  const { data: byDateData,  isLoading: dateLoading  } = useStatsByDate((dateTab === DATE_TAB.MONTH || dateTab === DATE_TAB.RANGE) && params ? params : null)
  const { data: byMonthData, isLoading: monthLoading } = useStatsByMonth(dateTab === DATE_TAB.YEAR  && params ? params : null)
  const { data: top10Data,   isLoading: top10Loading  } = useStatsTop10(params)

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
      {/* 결제수단 선택 칩 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ss.chipList}>
        {methods.map(method => {
          const active = selectedPaymentMethodId === method.id
          return (
            <TouchableOpacity
              key={method.id}
              style={[ss.chip, {
                backgroundColor: active ? theme.colors.primary : theme.colors.surfaceVariant,
              }]}
              onPress={() => onSelectPaymentMethod(active ? null : method.id)}
              activeOpacity={0.7}
            >
              <Text style={ss.chipIcon}>{PAYMENT_METHOD_EMOJI[method.type]}</Text>
              <Text style={[ss.chipText, { color: active ? '#fff' : theme.colors.text.primary }]} numberOfLines={1}>
                {method.name}
                {method.cardNumber ? <Text style={ss.chipSub}> ({method.cardNumber})</Text> : null}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {!selectedPaymentMethodId ? (
        <View style={ss.emptyWrap}>
          <Text style={[ss.emptyText, { color: theme.colors.text.disabled }]}>{s.selectPaymentMethod}</Text>
        </View>
      ) : (
        <View style={{ paddingTop: 12 }}>
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
  chipText: { fontSize: 13, fontWeight: '500', maxWidth: 100 },
  chipSub:  { fontSize: 11, fontWeight: '400' },
  emptyWrap:{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText:{ fontSize: 14 },
})
