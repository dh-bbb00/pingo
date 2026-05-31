import React, { useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
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

const s = strings.history
const DATE_TABS: HistoryDateTab[] = [s.tabDay, s.tabMonth, s.tabYear]

function startOfDay(d: Date) {
  const r = new Date(d); r.setHours(0, 0, 0, 0); return r
}
function endOfDay(d: Date) {
  const r = new Date(d); r.setHours(23, 59, 59, 999); return r
}
function isToday(d: Date) {
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}
function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

export default function HistoryScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { filter, setTab, setDate } = useHistoryFilter()

  const dateFilter = useMemo(() => ({
    startDate: startOfDay(filter.date).toISOString(),
    endDate:   endOfDay(filter.date).toISOString(),
  }), [filter.date])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTransactions(dateFilter)

  const transactions = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])
  const totalAmount  = data?.pages[0]?.pagination.totalAmount ?? 0

  const todayFlag = isToday(filter.date)

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionItem
      item={item}
      onPress={() => navigation.navigate(Screens.History.TransactionEdit, { id: item.id })}
    />
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

      {/* 날짜 네비게이션 (일 탭) */}
      <DateNavigator
        date={filter.date}
        onChange={setDate}
        onPrev={() => setDate(addDays(filter.date, -1))}
        onNext={() => setDate(addDays(filter.date, 1))}
        disableNext={todayFlag}
        todayBadge={s.today}
        variant="flat"
      />

      {filter.tab === s.tabDay ? (
        <>
          {/* 총 금액 */}
          {!isLoading && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryAmount}>{s.totalAmount(totalAmount)}</Text>
            </View>
          )}

          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={renderItem}
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
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
            onEndReachedThreshold={0.3}
          />
        </>
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.empty}>{s.empty}</Text>
        </View>
      )}

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
