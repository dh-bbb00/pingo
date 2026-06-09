import React, { useMemo } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AdminMoreStackParamList } from '@/types/navigation'
import type { SchedulerLogType, SchedulerLog } from '@/api/endpoints/schedulerLogs.api'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useSchedulerLogDetail, useSchedulerLogs, useRunSchedulerByType } from './hooks/useSchedulerLogs'
import { makeStyles } from './SchedulerLogDetailScreen.styles'

type Props = NativeStackScreenProps<AdminMoreStackParamList, 'SchedulerLogDetail'>

const s = strings.schedulerManagement

function formatDatetime(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function LogCard({ log, t, styles }: { log: SchedulerLog; t: any; styles: any }) {
  const isSuccess = log.success
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
  )
}

/** 상태 카드에서 진입 — 타입별 최신 로그 조회 + 실행 버튼 */
function TypeDetailScreen({ type, year, month, styles, t }: {
  type: SchedulerLogType; year: number; month: number; styles: any; t: any
}) {
  const { data: logsData, isLoading, refetch } = useSchedulerLogs('all', year, month)
  const { mutate: run, isPending } = useRunSchedulerByType()

  // 해당 타입의 이번 달 최신 로그
  const latestLog = useMemo(() => {
    const all = logsData?.pages.flatMap((p) => p.data) ?? []
    return all.find((l) => l.type === type) ?? null
  }, [logsData, type])

  function handleRun() {
    Alert.alert(s.runByTypeBtn, s.runByTypeConfirm(s.types[type]), [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, onPress: () => run({ type, year, month }, { onSuccess: () => refetch() }) },
    ])
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {latestLog
          ? <LogCard log={latestLog} t={t} styles={styles} />
          : (
            <View style={styles.notRunCard}>
              <View style={[styles.badge, { backgroundColor: t.colors.text.disabled }]}>
                <Text style={styles.badgeText}>{s.statusCard.notRun}</Text>
              </View>
              <Text style={styles.notRunText}>
                {`${year}년 ${month}월 ${s.types[type]}`}
              </Text>
              <Text style={[styles.notRunText, { marginTop: 4 }]}>{s.empty}</Text>
            </View>
          )
        }
      </ScrollView>

      <View style={styles.runButtonWrapper}>
        <TouchableOpacity style={styles.runButton} onPress={handleRun} disabled={isPending}>
          {isPending
            ? <ActivityIndicator size="small" color={t.colors.text.inverse} />
            : <Text style={styles.runButtonText}>{`${s.types[type]} ${s.runByTypeBtn}`}</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function SchedulerLogDetailScreen({ route }: Props) {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])

  const params = route.params

  // 상태 카드 탭: type+year+month로 접근
  if (!('id' in params)) {
    return <TypeDetailScreen type={params.type as SchedulerLogType} year={params.year} month={params.month} styles={styles} t={t} />
  }

  // 로그 리스트 탭: id로 접근
  return <IdDetailScreen id={params.id} styles={styles} t={t} />
}

function IdDetailScreen({ id, styles, t }: { id: string; styles: any; t: any }) {
  const { data: log, isLoading, refetch } = useSchedulerLogDetail(id)
  const { mutate: run, isPending } = useRunSchedulerByType()

  const s = strings.schedulerManagement

  function handleRun() {
    if (!log) return
    Alert.alert(s.runByTypeBtn, s.runByTypeConfirm(s.types[log.type]), [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, onPress: () => run({ type: log.type, year: log.year, month: log.month }, { onSuccess: () => refetch() }) },
    ])
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
      </View>
    )
  }

  if (!log) return null

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LogCard log={log} t={t} styles={styles} />
      </ScrollView>

      <View style={styles.runButtonWrapper}>
        <TouchableOpacity style={styles.runButton} onPress={handleRun} disabled={isPending}>
          {isPending
            ? <ActivityIndicator size="small" color={t.colors.text.inverse} />
            : <Text style={styles.runButtonText}>{`${s.types[log.type]} ${s.runByTypeBtn}`}</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}
