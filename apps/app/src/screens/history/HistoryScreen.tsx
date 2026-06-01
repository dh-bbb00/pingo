import React, { useMemo } from 'react'
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
import { useHistoryFilter } from './hooks/useHistoryFilter'
import type { HistoryDateTab } from './types'
import DateNavigator from '@/components/DateNavigator'
import { makeStyles } from './HistoryScreen.styles'

type Nav = NativeStackNavigationProp<HistoryStackParamList, 'HistoryMain'>

const s  = strings.history
const dp = strings.datePicker
const DATE_TABS: HistoryDateTab[] = [s.tabDay, s.tabMonth, s.tabYear]

type Section = { title: string; data: Transaction[]; total: number }

function startOfDay(d: Date) { const r = new Date(d); r.setHours(0, 0, 0, 0); return r }
function endOfDay(d: Date)   { const r = new Date(d); r.setHours(23, 59, 59, 999); return r }
function addDays(d: Date, n: number)   { const r = new Date(d); r.setDate(r.getDate() + n); return r }
function addMonths(d: Date, n: number) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r }
function addYears(d: Date, n: number)  { const r = new Date(d); r.setFullYear(r.getFullYear() + n); return r }

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

  return Array.from(groupMap.values()).map(g => ({
    ...g,
    total: g.data.reduce((sum, t) => sum + t.amount, 0),
  }))
}

export default function HistoryScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { filter, setTab, setDate } = useHistoryFilter()

  const dateFilter = useMemo(() => {
    const d = filter.date
    if (filter.tab === s.tabMonth) {
      return {
        startDate: new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0).toISOString(),
        endDate:   new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
      }
    }
    if (filter.tab === s.tabYear) {
      return {
        startDate: new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0).toISOString(),
        endDate:   new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString(),
      }
    }
    return {
      startDate: startOfDay(d).toISOString(),
      endDate:   endOfDay(d).toISOString(),
    }
  }, [filter.date, filter.tab])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTransactions(dateFilter)

  const transactions = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])
  const totalAmount  = data?.pages[0]?.pagination.totalAmount ?? 0

  const sections = useMemo(
    () => groupTransactions(transactions, filter.tab),
    [transactions, filter.tab],
  )

  const now = new Date()
  const disableNext = filter.tab === s.tabYear
    ? filter.date.getFullYear() >= now.getFullYear()
    : filter.tab === s.tabMonth
      ? filter.date.getFullYear() >= now.getFullYear() && filter.date.getMonth() >= now.getMonth()
      : filter.date >= startOfDay(now)

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionItem
      item={item}
      onPress={() => navigation.navigate(Screens.History.TransactionEdit, { id: item.id })}
    />
  )

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionSubtotal}>{section.total.toLocaleString()}원</Text>
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

      {/* 총 금액 */}
      {!isLoading && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryAmount}>{s.totalAmount(totalAmount)}</Text>
        </View>
      )}

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
          !isLoading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>{s.empty}</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage
            ? <ActivityIndicator style={styles.footer} color={theme.colors.primary} />
            : null
        }
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
        onEndReachedThreshold={0.3}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(Screens.History.TransactionEdit, {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
