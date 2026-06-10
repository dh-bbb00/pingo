import React, { useMemo, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { showConfirm } from '@/store/confirmStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useNotificationLogStore } from '@/store/notificationLogStore'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { parseCardNotification } from '@/utils/cardNotificationParser'
import { makeStyles } from './NotificationLogScreen.styles'
import type { DetectedNotification } from '@/store/notificationLogStore'

const s = strings.notificationLog

export default function NotificationLogScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { notifications, load, clear } = useNotificationLogStore()
  const { refreshing, onRefresh } = usePullToRefresh(load)

  useEffect(() => { load() }, [load])

  function handleClear() {
    showConfirm(s.clearBtn, '전체 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: clear },
    ])
  }

  function renderItem({ item }: { item: DetectedNotification }) {
    const date = new Date(parseInt(item.time, 10))
    const receivedAt = isNaN(date.getTime()) ? item.time : date.toLocaleString('ko-KR')

    const parsed = parseCardNotification(item.title, item.text)
    const cs = s.card

    return (
      <View style={styles.card}>
        {parsed ? (
          <>
            {([
              { label: cs.issuer,   value: `${parsed.issuer} (${parsed.last4})` },
              { label: cs.amount,   value: parsed.amountStr },
              {
                label: cs.payType,
                value: parsed.isInstallment
                  ? (parsed.installmentMonths ? `${parsed.installmentMonths}개월 할부` : '할부')
                  : '일시불',
              },
              { label: cs.date,     value: parsed.date },
              { label: cs.time,     value: parsed.time },
              { label: cs.merchant, value: parsed.merchant },
            ] as const).map(({ label, value }) => (
              <View key={label} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
          </>
        ) : (
          <>
            {item.title ? <Text style={styles.titleText}>{item.title}</Text> : null}
            <View style={styles.row}>
              <Text style={styles.label}>{s.appLabel}</Text>
              <Text style={styles.value}>{item.app}</Text>
            </View>
            {item.text ? (
              <View style={styles.row}>
                <Text style={styles.label}>내용</Text>
                <Text style={styles.value}>{item.text}</Text>
              </View>
            ) : null}
          </>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>{s.timeLabel}</Text>
          <Text style={styles.value}>{receivedAt}</Text>
        </View>
        <Text style={[styles.label, { marginTop: 4 }]}>{s.rawLabel}</Text>
        <View style={styles.rawBox}>
          <Text selectable style={styles.rawText}>{item.raw}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{s.header}</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearBtn}>{s.clearBtn}</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{s.empty}</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        />
      )}
    </View>
  )
}
