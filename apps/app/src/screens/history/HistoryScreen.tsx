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

  const prevDay = () => {
    const d = new Date(filter.date); d.setDate(d.getDate() - 1); setDate(d)
  }
  const nextDay = () => {
    const d = new Date(filter.date); d.setDate(d.getDate() + 1); setDate(d)
  }
  const todayFlag = isToday(filter.date)

  const dateLabel = s.dateFormat(
    filter.date.getFullYear(),
    filter.date.getMonth() + 1,
    filter.date.getDate(),
  )

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
      <View style={styles.dateNav}>
        <TouchableOpacity style={styles.navBtn} onPress={prevDay} activeOpacity={0.6}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.dateCenter}>
          <Text style={styles.dateText}>{dateLabel}</Text>
          {todayFlag && <Text style={styles.todayBadge}>{s.today}</Text>}
        </View>
        <TouchableOpacity style={styles.navBtn} onPress={nextDay} activeOpacity={todayFlag ? 1 : 0.6} disabled={todayFlag}>
          <Text style={[styles.navArrow, todayFlag && styles.navArrowDisabled]}>›</Text>
        </TouchableOpacity>
      </View>

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
