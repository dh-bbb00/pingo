import React, { useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import type { AdminMoreStackParamList } from '@/types/navigation'
import type { SchedulerLog, NotRunEntry, SchedulerLogType, CurrentMonthStatusItem } from '@/api/endpoints/schedulerLogs.api'
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
import { makeStyles } from './SchedulerManagementScreen.styles'

const s = strings.schedulerManagement

type TabKey = 'all' | 'success' | 'failure' | 'notRun'
type Nav = NativeStackNavigationProp<AdminMoreStackParamList, 'SchedulerManagement'>

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',     label: s.tabs.all },
  { key: 'success', label: s.tabs.success },
  { key: 'failure', label: s.tabs.failure },
  { key: 'notRun',  label: s.tabs.notRun },
]

function getStatusColor(item: CurrentMonthStatusItem, t: ReturnType<typeof useTheme>['theme']) {
  if (!item.log) return t.colors.text.disabled
  return item.log.success ? t.colors.semantic.success : t.colors.semantic.error
}

function getStatusLabel(item: CurrentMonthStatusItem) {
  if (!item.log) return s.statusCard.notRun
  return item.log.success ? s.statusCard.success : s.statusCard.failure
}

function getBadgeColor(success: boolean, t: ReturnType<typeof useTheme>['theme']) {
  return success ? t.colors.semantic.success : t.colors.semantic.error
}

function formatYearMonth(year: number, month: number) {
  return `${year}년 ${month}월`
}

export default function SchedulerManagementScreen() {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])
  const navigation = useNavigation<Nav>()

  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [tab,   setTab]   = useState<TabKey>('all')

  const { data: statusData } = useCurrentMonthStatus()
  const {
    data: logsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSchedulerLogs(tab, year, month)
  const { data: notRunData } = useSchedulerNotRun(year, month)
  const { mutate: runMonthly, isPending: isRunning } = useRunMonthlyScheduler()

  const logs: SchedulerLog[] = useMemo(
    () => logsData?.pages.flatMap((p) => p.data) ?? [],
    [logsData],
  )

  function handleMonthChange(d: Date) {
    setYear(d.getFullYear())
    setMonth(d.getMonth() + 1)
  }

  function handlePrevMonth() {
    if (month === 1) { setYear((y) => y - 1); setMonth(12) }
    else setMonth((m) => m - 1)
  }

  function handleNextMonth() {
    if (month === 12) { setYear((y) => y + 1); setMonth(1) }
    else setMonth((m) => m + 1)
  }

  function handleRunMonthly() {
    Alert.alert(s.runBtn, s.runConfirm, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, onPress: () => runMonthly() },
    ])
  }

  function handleLogPress(log: SchedulerLog) {
    navigation.navigate(Screens.AdminMore.SchedulerLogDetail, { id: log.id })
  }

  function handleStatusCardPress(item: CurrentMonthStatusItem) {
    navigation.navigate(Screens.AdminMore.SchedulerLogDetail, {
      type: item.type, year, month,
    })
  }

  function renderStatusCards() {
    if (!statusData) return null
    const nowYear  = new Date().getFullYear()
    const nowMonth = new Date().getMonth() + 1
    return (
      <View>
        <Text style={styles.statusSectionTitle}>{s.statusSectionTitle(nowYear, nowMonth)}</Text>
      <View style={styles.statusRow}>
        {statusData.map((item) => (
          <TouchableOpacity key={item.type} style={styles.statusCard} onPress={() => handleStatusCardPress(item)}>
            <Text style={styles.statusCardType}>{s.types[item.type as SchedulerLogType]}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item, t) }]}>
              <Text style={styles.statusBadgeText}>{getStatusLabel(item)}</Text>
            </View>
            {item.log && (
              <Text style={styles.statusCount}>{`${item.log.successCount}/${item.log.totalCount}`}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      </View>
    )
  }

  function renderLogItem({ item }: { item: SchedulerLog }) {
    return (
      <TouchableOpacity style={styles.logCard} onPress={() => handleLogPress(item)}>
        <View style={styles.logCardRow}>
          <Text style={styles.logCardType}>{s.types[item.type]}</Text>
          <View style={[styles.logCardBadge, { backgroundColor: getBadgeColor(item.success, t) }]}>
            <Text style={styles.logCardBadgeText}>
              {item.success ? s.statusCard.success : s.statusCard.failure}
            </Text>
          </View>
        </View>
        <View style={styles.logCardRow}>
          <Text style={styles.logCardMeta}>{formatYearMonth(item.year, item.month)}</Text>
          <Text style={styles.logCardCounts}>{`${item.successCount}/${item.totalCount}건`}</Text>
        </View>
        <Text style={styles.logCardMeta}>{s.triggers[item.triggeredBy]}</Text>
      </TouchableOpacity>
    )
  }

  function renderNotRunItem({ item }: { item: NotRunEntry }) {
    return (
      <View style={styles.notRunCard}>
        <View>
          <Text style={styles.notRunType}>{s.types[item.type as SchedulerLogType]}</Text>
          <Text style={styles.logCardMeta}>{formatYearMonth(item.year, item.month)}</Text>
        </View>
        <View style={styles.notRunBadge}>
          <Text style={styles.notRunBadgeText}>{s.tabs.notRun}</Text>
        </View>
      </View>
    )
  }

  const listData = tab === 'notRun' ? (notRunData ?? []) : logs
  const isNotRunTab = tab === 'notRun'

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
          date={new Date(year, month - 1, 1)}
          onChange={handleMonthChange}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
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
        data={listData as (SchedulerLog | NotRunEntry)[]}
        keyExtractor={(item, i) => {
          if ('id' in item) return item.id
          return `${item.type}-${item.year}-${item.month}-${i}`
        }}
        renderItem={isNotRunTab
          ? renderNotRunItem as ({ item }: { item: SchedulerLog | NotRunEntry }) => React.ReactElement
          : renderLogItem as ({ item }: { item: SchedulerLog | NotRunEntry }) => React.ReactElement
        }
        ListEmptyComponent={<Text style={styles.empty}>{s.empty}</Text>}
        contentContainerStyle={styles.listContent}
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
      />
    </View>
  )
}
