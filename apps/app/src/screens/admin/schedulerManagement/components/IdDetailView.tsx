import React, { useMemo } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import { showConfirm } from '@/store/confirmStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useSchedulerLogDetail, useRunSchedulerByType } from '../hooks/useSchedulerLogs'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { makeStyles } from './IdDetailView.styles'
import LogDetailCard from './LogDetailCard'

const s = strings.schedulerManagement

interface Props {
  id: string
}

export default function IdDetailView({ id }: Props) {
  const { theme: t } = useTheme()
  const styles = useMemo(() => makeStyles(t), [t])

  const { data: log, isLoading, refetch } = useSchedulerLogDetail(id)
  const { mutate: run, isPending } = useRunSchedulerByType()
  const { refreshing, onRefresh } = usePullToRefresh(refetch)

  function handleRun() {
    if (!log) return
    showConfirm(s.runByTypeBtn, s.runByTypeConfirm(s.types[log.type]), [
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[t.colors.primary]} />}
      >
        <LogDetailCard log={log} />
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
