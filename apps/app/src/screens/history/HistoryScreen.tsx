import React, { useMemo, useState } from 'react'
import { View, Text, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { HistoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { useTransactions } from '@/hooks/queries/useTransactions'
import type { Transaction } from '@/api/endpoints/transactions.api'
import TransactionItem from './components/TransactionItem'
import TransactionItemSkeleton from './components/TransactionItemSkeleton'
import { useHistoryFilter } from './hooks/useHistoryFilter'
import type { HistoryDateTab } from './types'
import DateNavigator from '@/components/DateNavigator'
import PaymentMethodPickerModal from './components/PaymentMethodPickerModal'
import CategoryFilterModal from './components/CategoryFilterModal'
import { makeStyles } from './HistoryScreen.styles'
import { startOfDay, endOfDay, addDays, addMonths, addYears, isSameDay, isSameMonth, isSameYear } from '@/utils/date'

type Nav = NativeStackNavigationProp<HistoryStackParamList, 'HistoryMain'>

const s  = strings.history
const dp = strings.datePicker
const DATE_TABS: HistoryDateTab[] = [s.tabDay, s.tabMonth, s.tabYear]

type Section = { title: string; data: Transaction[] }

const SKELETON_KEYS = Array.from({ length: 7 }, (_, i) => `sk-${i}`)


function groupTransactions(transactions: Transaction[], tab: HistoryDateTab): Section[] {
  const groupMap = new Map<string, { title: string; data: Transaction[] }>()

  for (const t of transactions) {
    const d = new Date(t.transactionDate)
    let key: string
    let title: string

    if (tab === s.tabDay) {
      const hour = d.getHours()
      key   = String(hour).padStart(2, '0')
      title = s.groupHourFmt(hour)
    } else if (tab === s.tabMonth) {
      const day = d.getDate()
      key   = String(day).padStart(2, '0')  // 정렬용 패딩
      title = s.groupDayFmt(day, dp.weekdays[d.getDay()])
    } else {
      const month = d.getMonth()
      key   = String(month).padStart(2, '0')
      title = s.groupMonthFmt(month + 1)
    }

    if (!groupMap.has(key)) groupMap.set(key, { title, data: [] })
    groupMap.get(key)!.data.push(t)
  }

  return Array.from(groupMap.values())
}

export default function HistoryScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { filter, setTab, setDate, setCategoryIds, setPaymentMethodIds } = useHistoryFilter()
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false)

  const categoryLabel = filter.categoryIds.length === 0
    ? s.filterCategory
    : s.filterCategorySelected(filter.categoryIds.length)
  const paymentLabel = filter.paymentMethodIds.length === 0
    ? s.filterPaymentMethod
    : s.filterPaymentMethodSelected(filter.paymentMethodIds.length)

  const queryFilter = useMemo(() => {
    const d = filter.date
    const base = {
      ...(filter.categoryIds.length      && { categoryIds:      filter.categoryIds }),
      ...(filter.paymentMethodIds.length && { paymentMethodIds: filter.paymentMethodIds }),
    }
    if (filter.tab === s.tabMonth) {
      return {
        ...base,
        startDate: new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0).toISOString(),
        endDate:   new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
      }
    }
    if (filter.tab === s.tabYear) {
      return {
        ...base,
        startDate: new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0).toISOString(),
        endDate:   new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString(),
      }
    }
    return {
      ...base,
      startDate: startOfDay(d).toISOString(),
      endDate:   endOfDay(d).toISOString(),
    }
  }, [filter.date, filter.tab, filter.categoryIds, filter.paymentMethodIds])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTransactions(queryFilter)

  const transactions = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])
  const totalAmount  = data?.pages[0]?.pagination.totalAmount ?? 0

  const sections = useMemo(
    () => groupTransactions(transactions, filter.tab),
    [transactions, filter.tab],
  )

  const now = new Date()
  const disableNext = filter.tab === s.tabYear
    ? isSameYear(filter.date, now)
    : filter.tab === s.tabMonth
      ? isSameMonth(filter.date, now)
      : isSameDay(filter.date, now)

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionItem
      item={item}
      onPress={() => navigation.navigate(Screens.History.TransactionEdit, { id: item.id })}
    />
  )

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{s.header}</Text>

      {/* 탭바 */}
      <View style={styles.tabBar}>
        {DATE_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter.tab === tab && styles.tabActive]}
            onPress={() => setTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, filter.tab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 날짜 네비게이션 */}
      <DateNavigator
        date={filter.date}
        onChange={setDate}
        mode={filter.tab === s.tabYear ? 'year' : filter.tab === s.tabMonth ? 'month' : 'day'}
        onPrev={() => setDate(
          filter.tab === s.tabYear  ? addYears(filter.date, -1)  :
          filter.tab === s.tabMonth ? addMonths(filter.date, -1) :
          addDays(filter.date, -1)
        )}
        onNext={() => setDate(
          filter.tab === s.tabYear  ? addYears(filter.date, 1)  :
          filter.tab === s.tabMonth ? addMonths(filter.date, 1) :
          addDays(filter.date, 1)
        )}
        disableNext={disableNext}
        todayBadge={s.today}
        variant="flat"
      />

      {/* 카테고리 + 결제수단 필터 */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter.categoryIds.length > 0 && styles.filterChipActive]}
          onPress={() => setShowCategoryPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterChipText, filter.categoryIds.length > 0 && styles.filterChipTextActive]}>
            {categoryLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter.paymentMethodIds.length > 0 && styles.filterChipActive]}
          onPress={() => setShowPaymentMethodPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterChipText, filter.paymentMethodIds.length > 0 && styles.filterChipTextActive]}>
            {paymentLabel}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 총 금액 */}
      {!isLoading && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryAmount}>{s.totalAmount(totalAmount)}</Text>
        </View>
      )}

      {isLoading && !data ? (
        <View style={styles.list}>
          {SKELETON_KEYS.map((key, i) => (
            <React.Fragment key={key}>
              {i === 0 && <View style={styles.sectionHeader}><View style={styles.skeletonSectionTitle} /></View>}
              {i === 3 && <View style={styles.sectionHeader}><View style={styles.skeletonSectionTitle} /></View>}
              <TransactionItemSkeleton />
              {i < SKELETON_KEYS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>{s.empty}</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage
              ? <ActivityIndicator style={styles.footer} color={theme.colors.primary} />
              : null
          }
          onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
          onEndReachedThreshold={0.3}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(Screens.History.TransactionEdit, {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <CategoryFilterModal
        visible={showCategoryPicker}
        committedIds={filter.categoryIds}
        onConfirm={setCategoryIds}
        onClose={() => setShowCategoryPicker(false)}
      />
      <PaymentMethodPickerModal
        mode="multi"
        visible={showPaymentMethodPicker}
        committedIds={filter.paymentMethodIds}
        onConfirm={setPaymentMethodIds}
        onClose={() => setShowPaymentMethodPicker(false)}
      />
    </SafeAreaView>
  )
}
