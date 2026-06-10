import React, { useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { showConfirm } from '@/store/confirmStore'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import type { AdminMoreStackParamList } from '@/types/navigation'
import type { SchedulerLog, SchedulerLogType, SchedulerLogStatus, CurrentMonthStatusItem } from '@/api/endpoints/schedulerLogs.api'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { Screens } from '@/constants/screens'
import DateNavigator from '@/components/DateNavigator'
import {
  useCurrentMonthStatus,
  useSchedulerLogs,
  useSchedulerNotRun,
  useRunMonthlyScheduler,
} from './hooks/useSchedulerLogs'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { makeStyles } from './SchedulerManagementScreen.styles'

const s = strings.schedulerManagement

type TabKey = 'all' | 'success' | 'failure' | 'notRun'
type Nav = NativeStackNavigationProp<AdminMoreStackParamList, 'SchedulerManagement'>

type GroupHeader = { _kind: 'header'; year: number; month: number }
type ListItem = GroupHeader | SchedulerLog

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',     label: s.tabs.all },
  { key: 'success', label: s.tabs.success },
  { key: 'failure', label: s.tabs.failure },
  { key: 'notRun',  label: s.tabs.notRun },
]

function getStatusColor(item: CurrentMonthStatusItem, t: ReturnType<typeof useTheme>['theme']) {
  const status = item.log?.status
  if (!status || status === 'NOT_RUN') return t.colors.text.disabled
  return status === 'SUCCESS' ? t.colors.semantic.success : t.colors.semantic.error
}

function getStatusLabel(item: CurrentMonthStatusItem) {
  const status = item.log?.status
  if (!status || status === 'NOT_RUN') return s.statusCard.notRun
  return status === 'SUCCESS' ? s.statusCard.success : s.statusCard.failure
}

function getBadgeColor(status: SchedulerLogStatus, t: ReturnType<typeof useTheme>['theme']) {
  if (status === 'SUCCESS') return t.colors.semantic.success
  if (status === 'FAILURE') return t.colors.semantic.error
  return t.colors.text.disabled
}

function formatYearMonth(year: number, month: number) {
  return `${year}년 ${month}월`
}

function groupByMonth(items: SchedulerLog[]): ListItem[] {
  const result: ListItem[] = []
  let lastKey = ''
  for (const item of items) {
    const key = `${item.year}-${item.month}`
    if (key !== lastKey) {
      result.push({ _kind: 'header', year: item.year, month: item.month })
      lastKey = key
    }
    result.push(item)
  }
  return result
}

export default function SchedulerManagementScreen() {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])
  const navigation = useNavigation<Nav>()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [tab, setTab] = useState<TabKey>('all')

  const year  = selectedDate?.getFullYear()
  const month = selectedDate ? selectedDate.getMonth() + 1 : undefined

  const { data: statusData, refetch: refetchStatus } = useCurrentMonthStatus()
  const {
    data: logsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchLogs,
  } = useSchedulerLogs(tab, year, month)
  const { data: notRunData, refetch: refetchNotRun } = useSchedulerNotRun(year, month)
  const { refreshing, onRefresh } = usePullToRefresh(() => Promise.all([refetchStatus(), refetchLogs(), refetchNotRun()]))
  const { mutate: runMonthly, isPending: isRunning } = useRunMonthlyScheduler()

  const flatLogs: SchedulerLog[] = useMemo(
    () => tab === 'notRun'
      ? (notRunData ?? [])
      : logsData?.pages.flatMap((p) => p.data) ?? [],
    [tab, logsData, notRunData],
  )

  const listData: ListItem[] = useMemo(
    () => groupByMonth(flatLogs),
    [flatLogs],
  )

  function handlePrevMonth() {
    if (!selectedDate) return
    const d = new Date(selectedDate)
    d.setMonth(d.getMonth() - 1)
    setSelectedDate(new Date(d))
  }

  function handleNextMonth() {
    if (!selectedDate) return
    const d = new Date(selectedDate)
    d.setMonth(d.getMonth() + 1)
    setSelectedDate(new Date(d))
  }

  function handleRunMonthly() {
    showConfirm(s.runBtn, s.runConfirm, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, onPress: () => runMonthly() },
    ])
  }

  function handleLogPress(log: SchedulerLog) {
    navigation.navigate(Screens.AdminMore.SchedulerLogDetail, { id: log.id })
  }

  function handleStatusCardPress(item: CurrentMonthStatusItem) {
    const now = new Date()
    navigation.navigate(Screens.AdminMore.SchedulerLogDetail, {
      type: item.type, year: now.getFullYear(), month: now.getMonth() + 1,
    })
  }

  function renderStatusCards() {
    if (!statusData) return null
    const now = new Date()
    return (
      <View>
        <Text style={styles.statusSectionTitle}>{s.statusSectionTitle(now.getFullYear(), now.getMonth() + 1)}</Text>
        <View style={styles.statusRow}>
          {statusData.map((item) => (
            <TouchableOpacity key={item.type} style={styles.statusCard} onPress={() => handleStatusCardPress(item)}>
              <Text style={styles.statusCardType}>{s.types[item.type as SchedulerLogType]}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item, t) }]}>
                <Text style={styles.statusBadgeText}>{getStatusLabel(item)}</Text>
              </View>
              {item.log?.successCount != null && (
                <Text style={styles.statusCount}>{`${item.log.successCount}/${item.log.totalCount}`}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  function renderItem({ item }: { item: ListItem }) {
    if ('_kind' in item) {
      return <Text style={styles.groupHeader}>{formatYearMonth(item.year, item.month)}</Text>
    }

    if (tab === 'notRun') {
      return (
        <View style={styles.notRunCard}>
          <Text style={styles.notRunType}>{s.types[item.type as SchedulerLogType]}</Text>
          <View style={styles.notRunBadge}>
            <Text style={styles.notRunBadgeText}>{s.tabs.notRun}</Text>
          </View>
        </View>
      )
    }

    return (
      <TouchableOpacity style={styles.logCard} onPress={() => handleLogPress(item)}>
        <View style={styles.logCardRow}>
          <Text style={styles.logCardType}>{s.types[item.type]}</Text>
          <View style={[styles.logCardBadge, { backgroundColor: getBadgeColor(item.status, t) }]}>
            <Text style={styles.logCardBadgeText}>
              {item.status === 'SUCCESS' ? s.statusCard.success : s.statusCard.failure}
            </Text>
          </View>
        </View>
        <View style={styles.logCardRow}>
          <Text style={styles.logCardCounts}>{`${item.successCount}/${item.totalCount}건`}</Text>
          <Text style={styles.logCardMeta}>{item.triggeredBy ? s.triggers[item.triggeredBy] : ''}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  function keyExtractor(item: ListItem) {
    if ('_kind' in item) return `header-${item.year}-${item.month}`
    return item.id
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.header}>{s.header}</Text>

        {renderStatusCards()}

        <TouchableOpacity style={styles.runButton} onPress={handleRunMonthly} disabled={isRunning}>
          {isRunning
            ? <ActivityIndicator size="small" color={t.colors.text.inverse} />
            : <Text style={styles.runButtonText}>{s.runBtn}</Text>
          }
        </TouchableOpacity>

        <DateNavigator
          date={selectedDate}
          onChange={(d) => setSelectedDate(d)}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          onClear={() => setSelectedDate(null)}
          mode='month'
          variant='card'
        />
      </View>

      <View style={styles.tabBar}>
        {TABS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, tab === key && styles.tabActive]}
            onPress={() => setTab(key)}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>{s.empty}</Text>}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[t.colors.primary]} />}
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
      />
    </View>
  )
}
