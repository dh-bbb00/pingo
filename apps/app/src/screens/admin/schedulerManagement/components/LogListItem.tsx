import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { SchedulerLog, SchedulerLogType, SchedulerLogStatus } from '@/api/endpoints/schedulerLogs.api'
import { makeStyles } from './LogListItem.styles'

const s = strings.schedulerManagement

export type TabKey = 'all' | 'success' | 'failure' | 'notRun'
export type GroupHeader = { _kind: 'header'; year: number; month: number }
export type ListItem = GroupHeader | SchedulerLog

function getBadgeColor(status: SchedulerLogStatus, t: ReturnType<typeof useTheme>['theme']) {
  if (status === 'SUCCESS') return t.colors.semantic.success
  if (status === 'FAILURE') return t.colors.semantic.error
  return t.colors.text.disabled
}

interface Props {
  item: ListItem
  tab: TabKey
  onPress: (log: SchedulerLog) => void
}

export default function LogListItem({ item, tab, onPress }: Props) {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])

  if ('_kind' in item) {
    return <Text style={styles.groupHeader}>{`${item.year}년 ${item.month}월`}</Text>
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
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.cardRow}>
        <Text style={styles.cardType}>{s.types[item.type]}</Text>
        <View style={[styles.cardBadge, { backgroundColor: getBadgeColor(item.status, t) }]}>
          <Text style={styles.cardBadgeText}>
            {item.status === 'SUCCESS' ? s.statusCard.success : s.statusCard.failure}
          </Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardCounts}>{`${item.successCount}/${item.totalCount}건`}</Text>
        <Text style={styles.cardMeta}>{item.triggeredBy ? s.triggers[item.triggeredBy] : ''}</Text>
      </View>
    </TouchableOpacity>
  )
}
