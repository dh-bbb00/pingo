import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { CurrentMonthStatusItem, SchedulerLogType } from '@/api/endpoints/schedulerLogs.api'
import { makeStyles } from './StatusSection.styles'

const s = strings.schedulerManagement

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

interface Props {
  statusData: CurrentMonthStatusItem[]
  onPress: (item: CurrentMonthStatusItem) => void
}

export default function StatusSection({ statusData, onPress }: Props) {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])
  const now = new Date()

  return (
    <View>
      <Text style={styles.sectionTitle}>{s.statusSectionTitle(now.getFullYear(), now.getMonth() + 1)}</Text>
      <View style={styles.row}>
        {statusData.map((item) => (
          <TouchableOpacity key={item.type} style={styles.card} onPress={() => onPress(item)}>
            <Text style={styles.cardType}>{s.types[item.type as SchedulerLogType]}</Text>
            <View style={[styles.badge, { backgroundColor: getStatusColor(item, t) }]}>
              <Text style={styles.badgeText}>{getStatusLabel(item)}</Text>
            </View>
            {item.log?.successCount != null && (
              <Text style={styles.count}>{`${item.log.successCount}/${item.log.totalCount}`}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
