import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { SchedulerLog } from '@/api/endpoints/schedulerLogs.api'
import { makeStyles } from './LogDetailCard.styles'
import { formatDate } from '@/utils/date'

const s = strings.schedulerManagement

interface Props {
  log: SchedulerLog
}

export default function LogDetailCard({ log }: Props) {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])

  const isSuccess  = log.status === 'SUCCESS'
  const badgeColor = isSuccess ? t.colors.semantic.success : t.colors.semantic.error
  const badgeLabel = isSuccess ? s.statusCard.success : s.statusCard.failure

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>{s.detail.type}</Text>
        <Text style={styles.value}>{s.types[log.type]}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{s.detail.yearMonth}</Text>
        <Text style={styles.value}>{`${log.year}년 ${log.month}월`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{s.detail.status}</Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{s.detail.trigger}</Text>
        <Text style={styles.value}>{log.triggeredBy ? s.triggers[log.triggeredBy] : '-'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{s.detail.runAt}</Text>
        <Text style={styles.value}>{log.runAt ? formatDate(log.runAt, 'yyyy년 M월 d일 HH:mm') : '-'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{s.detail.totalCount}</Text>
        <Text style={styles.value}>{log.totalCount != null ? `${log.totalCount}건` : '-'}</Text>
      </View>
      <View style={[styles.row, !log.error && styles.lastRow]}>
        <Text style={styles.label}>{s.detail.successCount}</Text>
        <Text style={styles.value}>{log.successCount != null ? `${log.successCount}건` : '-'}</Text>
      </View>
      {log.error && (
        <View style={[styles.row, styles.lastRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <Text style={[styles.label, { marginBottom: 4 }]}>{s.detail.error}</Text>
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{log.error}</Text>
          </View>
        </View>
      )}
    </View>
  )
}
