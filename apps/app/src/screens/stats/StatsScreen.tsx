import React, { useMemo, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { UserTabParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { StatsMainTab } from './types'
import { useStatsFilter } from './hooks/useStatsFilter'
import { makeStyles } from './StatsScreen.styles'
import DateSubTabs from './components/DateSubTabs'
import DateNavigator from './components/DateNavigator'
import PeriodTab from './components/PeriodTab'
import CategoryTab from './components/CategoryTab'
import PaymentMethodTab from './components/PaymentMethodTab'
import { getPrevDate } from './utils'

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
    setSelectedCategoryId,
    setSelectedPaymentMethodId,
    applyParams,
  } = useStatsFilter()

  // 다른 화면에서 네비게이션 params로 탭/선택 항목 전달받을 때 적용
  useEffect(() => {
    const params = route.params
    if (!params) return
    applyParams({
      initialTab:      params.initialTab,
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
    if (dateTab === '일') setDate(new Date(y, m, d + 1))
    else if (dateTab === '월') setDate(new Date(y, m + 1, 1))
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

      {/* 일/월/년 서브 탭 */}
      <View style={styles.subTabWrap}>
        <DateSubTabs activeTab={filter.dateTab} onTabChange={setDateTab} />
        <DateNavigator dateTab={filter.dateTab} date={filter.date} onPrev={handlePrev} onNext={handleNext} />
      </View>

      {/* 탭별 콘텐츠 */}
      {filter.mainTab === 'period' && (
        <PeriodTab dateTab={filter.dateTab} date={filter.date} />
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
