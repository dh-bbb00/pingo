import React, { useMemo } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AdminMoreStackParamList } from '@/types/navigation'
import type { SchedulerLogType } from '@/api/endpoints/schedulerLogs.api'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useSchedulerLogDetail } from './hooks/useSchedulerLogs'
import { makeStyles } from './SchedulerLogDetailScreen.styles'

type Props = NativeStackScreenProps<AdminMoreStackParamList, 'SchedulerLogDetail'>

const s = strings.schedulerManagement

function formatDatetime(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function SchedulerLogDetailScreen({ route }: Props) {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])

  const params = route.params

  // id 파라미터가 있으면 API에서 로그 조회, 없으면 미실행 항목 표시
  const logId = 'id' in params ? params.id : ''
  const { data: log, isLoading } = useSchedulerLogDetail(logId)

  // 미실행 항목인 경우 (type+year+month로 접근)
  if (!('id' in params)) {
    const { type, year, month } = params
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.notRunCard}>
            <View style={[styles.badge, { backgroundColor: t.colors.text.disabled }]}>
              <Text style={styles.badgeText}>{s.statusCard.notRun}</Text>
            </View>
            <Text style={styles.notRunText}>
              {`${year}년 ${month}월 ${s.types[type as SchedulerLogType]}`}
            </Text>
            <Text style={[styles.notRunText, { marginTop: 4 }]}>{s.empty}</Text>
          </View>
        </ScrollView>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
      </View>
    )
  }

  if (!log) return null

  const isSuccess = log.success

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <View style={[styles.badge, { backgroundColor: isSuccess ? t.colors.semantic.success : t.colors.semantic.error }]}>
              <Text style={styles.badgeText}>{isSuccess ? s.statusCard.success : s.statusCard.failure}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{s.detail.trigger}</Text>
            <Text style={styles.value}>{s.triggers[log.triggeredBy]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{s.detail.runAt}</Text>
            <Text style={styles.value}>{formatDatetime(log.runAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{s.detail.totalCount}</Text>
            <Text style={styles.value}>{`${log.totalCount}건`}</Text>
          </View>
          <View style={[styles.row, !log.error && styles.lastRow]}>
            <Text style={styles.label}>{s.detail.successCount}</Text>
            <Text style={styles.value}>{`${log.successCount}건`}</Text>
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
      </ScrollView>
    </View>
  )
}
