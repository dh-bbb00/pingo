import React, { useMemo, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { UserTabParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { DATE_TAB } from './types'
import type { StatsMainTab } from './types'
import { useStatsFilter } from './hooks/useStatsFilter'
import { makeStyles } from './StatsScreen.styles'
import DateSubTabs from './components/DateSubTabs'
import DateNavigator from './components/DateNavigator'
import PeriodTab from './components/PeriodTab'
import CategoryTab from './components/CategoryTab'
import PaymentMethodTab from './components/PaymentMethodTab'
import { getPrevDate } from './utils'
import DatePickerModal from '@/components/DatePickerModal'
import MonthPickerModal from '@/components/MonthPickerModal'

const s = strings.stats

const MAIN_TABS: { key: StatsMainTab; label: string }[] = [
  { key: 'period',        label: s.tabPeriod },
  { key: 'category',      label: s.tabCategory },
  { key: 'paymentMethod', label: s.tabPaymentMethod },
]

export default function StatsScreen() {
  const { theme } = useTheme()
  const styles    = useMemo(() => makeStyles(theme), [theme])
  const route     = useRoute<RouteProp<UserTabParamList, 'Stats'>>()

  const {
    filter,
    setMainTab,
    setDateTab,
    setDate,
    setRangeStart,
    setRangeEnd,
    setSelectedCategoryId,
    setSelectedPaymentMethodId,
    applyParams,
  } = useStatsFilter()

  const [pickerVisible,      setPickerVisible]      = useState(false)
  // '기간' 모드에서 시작일/종료일 중 어느쪽 피커를 여는지
  const [rangePickerTarget,  setRangePickerTarget]  = useState<'start' | 'end'>('start')

  // 다른 화면에서 네비게이션 params로 탭/선택 항목 전달받을 때 적용
  useEffect(() => {
    const params = route.params
    if (!params) return
    applyParams({
      initialTab:      params.initialTab,
      dateTab:         params.dateTab,
      categoryId:      params.categoryId,
      paymentMethodId: params.paymentMethodId,
    })
  }, [route.params]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePrev() {
    setDate(getPrevDate(filter.dateTab, filter.date))
  }

  function handleNext() {
    const { dateTab, date } = filter
    const y = date.getFullYear()
    const m = date.getMonth()
    const d = date.getDate()
    if (dateTab === DATE_TAB.DAY)        setDate(new Date(y, m, d + 1))
    else if (dateTab === DATE_TAB.MONTH) setDate(new Date(y, m + 1, 1))
    else setDate(new Date(y + 1, m, d))
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>{s.header}</Text>

      {/* 기간 | 카테고리 | 결제수단 메인 탭 */}
      <View style={styles.mainTabBar}>
        {MAIN_TABS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.mainTab, filter.mainTab === key && styles.mainTabActive]}
            onPress={() => setMainTab(key)}
          >
            <Text style={[styles.mainTabText, filter.mainTab === key && styles.mainTabTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 일/월/년/기간 서브 탭 */}
      <View style={styles.subTabWrap}>
        <DateSubTabs activeTab={filter.dateTab} onTabChange={setDateTab} />
        {filter.dateTab === DATE_TAB.RANGE ? (
          <View style={styles.rangeRow}>
            <TouchableOpacity
              style={[styles.rangeBtn, { backgroundColor: theme.colors.surface }]}
              onPress={() => { setRangePickerTarget('start'); setPickerVisible(true) }}
              activeOpacity={0.7}
            >
              <Text style={[styles.rangeLabel, { color: theme.colors.text.secondary }]}>{s.rangeStart}</Text>
              <Text style={[styles.rangeDate, { color: theme.colors.text.primary }]}>
                {filter.rangeStart.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.rangeSep, { color: theme.colors.text.disabled }]}>{s.rangeSeparator}</Text>
            <TouchableOpacity
              style={[styles.rangeBtn, { backgroundColor: theme.colors.surface }]}
              onPress={() => { setRangePickerTarget('end'); setPickerVisible(true) }}
              activeOpacity={0.7}
            >
              <Text style={[styles.rangeLabel, { color: theme.colors.text.secondary }]}>{s.rangeEnd}</Text>
              <Text style={[styles.rangeDate, { color: theme.colors.text.primary }]}>
                {filter.rangeEnd.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <DateNavigator
            dateTab={filter.dateTab}
            date={filter.date}
            onPrev={handlePrev}
            onNext={handleNext}
            onPress={() => setPickerVisible(true)}
          />
        )}
      </View>

      {filter.dateTab === DATE_TAB.DAY && (
        <DatePickerModal
          visible={pickerVisible}
          selectedDate={filter.date}
          onSelect={setDate}
          onClose={() => setPickerVisible(false)}
        />
      )}
      {(filter.dateTab === DATE_TAB.MONTH || filter.dateTab === DATE_TAB.YEAR) && (
        <MonthPickerModal
          visible={pickerVisible}
          selectedYear={filter.date.getFullYear()}
          selectedMonth={filter.date.getMonth()}
          onSelect={(year, month) => {
            if (filter.dateTab === DATE_TAB.YEAR) setDate(new Date(year, 0, 1))
            else setDate(new Date(year, month, 1))
          }}
          onClose={() => setPickerVisible(false)}
        />
      )}
      {filter.dateTab === DATE_TAB.RANGE && (
        <DatePickerModal
          visible={pickerVisible}
          selectedDate={rangePickerTarget === 'start' ? filter.rangeStart : filter.rangeEnd}
          onSelect={(date) => {
            if (rangePickerTarget === 'start') setRangeStart(date)
            else setRangeEnd(date)
          }}
          onClose={() => setPickerVisible(false)}
        />
      )}

      {/* 탭별 콘텐츠 */}
      {filter.mainTab === 'period' && (
        <PeriodTab
          dateTab={filter.dateTab}
          date={filter.date}
          rangeStart={filter.rangeStart}
          rangeEnd={filter.rangeEnd}
        />
      )}
      {filter.mainTab === 'category' && (
        <CategoryTab
          dateTab={filter.dateTab}
          date={filter.date}
          selectedCategoryId={filter.selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      )}
      {filter.mainTab === 'paymentMethod' && (
        <PaymentMethodTab
          dateTab={filter.dateTab}
          date={filter.date}
          selectedPaymentMethodId={filter.selectedPaymentMethodId}
          onSelectPaymentMethod={setSelectedPaymentMethodId}
        />
      )}
    </SafeAreaView>
  )
}
