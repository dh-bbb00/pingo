import React, { useMemo } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import { showConfirm } from '@/store/confirmStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { SchedulerLogType } from '@/api/endpoints/schedulerLogs.api'
import { useSchedulerLogs, useRunSchedulerByType } from '../hooks/useSchedulerLogs'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { makeStyles } from './TypeDetailView.styles'
import LogDetailCard from './LogDetailCard'

const s = strings.schedulerManagement

interface Props {
  type: SchedulerLogType
  year: number
  month: number
}

export default function TypeDetailView({ type, year, month }: Props) {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])

  const { data: logsData, isLoading, refetch } = useSchedulerLogs('all', year, month)
  const { mutate: run, isPending } = useRunSchedulerByType()
  const { refreshing, onRefresh } = usePullToRefresh(refetch)

  const latestLog = useMemo(() => {
    const all = logsData?.pages.flatMap((p) => p.data) ?? []
    return all.find((l) => l.type === type) ?? null
  }, [logsData, type])

  function handleRun() {
    showConfirm(s.runByTypeBtn, s.runByTypeConfirm(s.types[type]), [
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[t.colors.primary]} />}
      >
        {latestLog
          ? <LogDetailCard log={latestLog} />
          : (
            <View style={styles.notRunCard}>
              <View style={[styles.badge, { backgroundColor: t.colors.text.disabled }]}>
                <Text style={styles.badgeText}>{s.statusCard.notRun}</Text>
              </View>
              <Text style={styles.notRunText}>{`${year}년 ${month}월 ${s.types[type]}`}</Text>
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
