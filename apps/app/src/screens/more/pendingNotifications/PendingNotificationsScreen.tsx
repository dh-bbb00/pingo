import React, { useMemo, useEffect, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl, Alert, ActivityIndicator,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { Screens } from '@/constants/screens'
import { navigationRef } from '@/navigation/navigationRef'
import { useNotificationLogStore, isOldUnregistered } from '@/store/notificationLogStore'
import type { DetectedNotification } from '@/store/notificationLogStore'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { parseCardNotification } from '@/utils/cardNotificationParser'
import { transactionsApi } from '@/api/endpoints/transactions.api'
import { handleApiError } from '@/api/errorHandler'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { makeStyles } from './PendingNotificationsScreen.styles'

const s = strings.pendingNotifications

/**
 * 파싱된 날짜(MM/DD)는 연도 정보가 없으므로, 알림 수신 시각(item.time)의 연도를 사용.
 * 단, 연말→연초 경계에서 12월 알림을 1월에 등록하면 미래 날짜가 될 수 있으므로 작년으로 보정.
 */
function buildTxDate(notification: DetectedNotification, parsed: ReturnType<typeof parseCardNotification>) {
  if (!parsed) return new Date()
  const receivedMs   = parseInt(notification.time, 10)
  const receivedDate = new Date(isNaN(receivedMs) ? Date.now() : receivedMs)
  const [month, day] = parsed.date.split('/').map(Number)
  const [hour, min]  = parsed.time.split(':').map(Number)
  let d = new Date(receivedDate.getFullYear(), month - 1, day, hour, min, 0, 0)
  if (d > new Date()) d.setFullYear(d.getFullYear() - 1)
  return d
}

/**
 * 일괄 등록용 API 페이로드 생성.
 * 카테고리/결제수단은 null (기타 미분류) 고정.
 * 할부 금액 계산은 TransactionEditScreen의 toPayload와 동일한 로직 적용
 * — 1회 납부금 = 총액 - (균등 월납금 × (개월 - 1)), 나머지 차액은 첫달에 흡수.
 */
function buildPayload(notification: DetectedNotification, parsed: NonNullable<ReturnType<typeof parseCardNotification>>) {
  const txDate  = buildTxDate(notification, parsed)
  // installmentMonths가 null이거나 1이하면 일시불로 처리
  const months  = parsed.isInstallment && parsed.installmentMonths != null ? parsed.installmentMonths : 0
  const isInstallment = months >= 2
  const total   = parsed.amount

  if (!isInstallment) {
    return {
      merchantName:       parsed.merchant,
      amount:             total,
      categoryId:         null,
      paymentMethodId:    null,
      transactionDate:    txDate.toISOString(),
      installmentMonths:  null,
      totalAmount:        null,
      installmentEndDate: null,
    }
  }

  const monthly = Math.floor(total / months)
  const amount  = total - monthly * (months - 1)
  // 마지막 납부월: 거래일 기준 (months - 1)달 뒤 1일
  const installmentEndDate = new Date(txDate.getFullYear(), txDate.getMonth() + months - 1, 1).toISOString()

  return {
    merchantName:       parsed.merchant,
    amount,
    categoryId:         null,
    paymentMethodId:    null,
    transactionDate:    txDate.toISOString(),
    installmentMonths:  months,
    totalAmount:        total,
    installmentEndDate,
  }
}

export default function PendingNotificationsScreen() {
  const { theme } = useTheme()
  const styles    = useMemo(() => makeStyles(theme), [theme])
  const queryClient = useQueryClient()

  const { notifications, load, markAsRegistered } = useNotificationLogStore()
  const { refreshing, onRefresh } = usePullToRefresh(load)

  // 일괄 등록 진행 중 오버레이 표시용
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => { load() }, [load])

  const unregistered = notifications

  /**
   * 건별 등록: History 탭의 TransactionEdit으로 이동하며 notificationId를 전달.
   * TransactionEdit에서 이 id로 알림 데이터를 읽어 폼 자동 세팅.
   * More 스택 → History 스택 교차 이동이므로 navigationRef 사용.
   */
  function navigateToRegister(notificationId: string) {
    navigationRef.navigate(Screens.Root.UserTabs as any, {
      screen: Screens.UserTab.History,
      params: {
        screen: Screens.History.TransactionEdit,
        params: { notificationId },
      },
    })
  }

  /**
   * 일괄 등록 실행: 순차 처리하여 일부 실패해도 나머지는 계속 진행.
   * 성공한 항목만 markAsRegistered 처리하고, 실패 건은 store에 미등록 상태로 유지.
   */
  async function executeBulkRegister(
    items: Array<{ n: DetectedNotification; parsed: NonNullable<ReturnType<typeof parseCardNotification>> }>,
  ) {
    setBulkLoading(true)
    let ok = 0
    let fail = 0
    for (const { n, parsed } of items) {
      try {
        await transactionsApi.create(buildPayload(n, parsed))
        markAsRegistered(n.id)
        ok++
      } catch (err) {
        handleApiError(err)
        fail++
      }
    }
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all }),
    ])
    setBulkLoading(false)

    if (fail === 0) {
      Toast.show({ type: 'success', text1: s.bulkSuccessMsg(ok) })
    } else {
      Toast.show({ type: 'info', text1: s.bulkPartialMsg(ok, fail) })
    }
  }

  function handleBulkRegister() {
    // 파싱 불가 알림은 일괄 등록 대상에서 제외 — 필수 정보(금액/가맹점/날짜) 부재
    const parseable = unregistered
      .map(n => ({ n, parsed: parseCardNotification(n.title, n.text) }))
      .filter((x): x is { n: DetectedNotification; parsed: NonNullable<ReturnType<typeof parseCardNotification>> } =>
        x.parsed !== null
      )

    if (parseable.length === 0) {
      Alert.alert(s.bulkNothingTitle, s.bulkNothingMsg)
      return
    }

    const listText = parseable
      .map(x => `• ${x.parsed.merchant}  ${x.parsed.amountStr}  (${x.parsed.date})`)
      .join('\n')

    Alert.alert(
      s.bulkConfirmTitle,
      `${s.bulkCategoryNotice}\n\n${listText}\n\n${s.bulkConfirmMsg(parseable.length)}`,
      [
        { text: s.bulkConfirmCancel, style: 'cancel' },
        { text: s.bulkConfirmOk, onPress: () => executeBulkRegister(parseable) },
      ],
    )
  }

  function renderItem({ item }: { item: DetectedNotification }) {
    const parsed     = parseCardNotification(item.title, item.text)
    const isOld      = isOldUnregistered(item)
    const receivedMs = parseInt(item.time, 10)
    const receivedAt = isNaN(receivedMs)
      ? item.time
      : new Date(receivedMs).toLocaleString('ko-KR')

    const cs = s.card

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardMeta}>
            {/* 3일 이상 미등록 건 강조 — 등록 유도 */}
            {isOld && (
              <View style={styles.oldBadge}>
                <Text style={styles.oldBadgeText}>{s.oldBadge}</Text>
              </View>
            )}
            <Text style={styles.receivedTime}>{receivedAt}</Text>
          </View>
          {/* 파싱 성공한 경우만 등록 버튼 노출 — 파싱 불가는 수동 등록 불가 */}
          {parsed && (
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigateToRegister(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.registerBtnText}>{s.registerBtn}</Text>
            </TouchableOpacity>
          )}
        </View>

        {parsed ? (
          <>
            {([
              { label: cs.merchant, value: parsed.merchant },
              { label: cs.amount,   value: parsed.amountStr },
              {
                label: cs.payType,
                value: parsed.isInstallment
                  ? (parsed.installmentMonths ? s.installmentFmt(parsed.installmentMonths) : s.installmentUnknown)
                  : s.lumpSum,
              },
              { label: cs.issuer,   value: `${parsed.issuer} (${parsed.last4})` },
              { label: cs.date,     value: `${parsed.date} ${parsed.time}` },
            ] as const).map(({ label, value }) => (
              <View key={label} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
          </>
        ) : (
          // 파싱 실패 시 원본 텍스트 그대로 노출
          <>
            <Text style={styles.rawText} numberOfLines={3}>{item.text || item.title}</Text>
            <Text style={styles.unparseableText}>{s.unparseable}</Text>
          </>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{s.header}</Text>
        {unregistered.length > 0 && (
          <TouchableOpacity onPress={handleBulkRegister} disabled={bulkLoading}>
            <Text style={styles.bulkBtn}>{s.bulkRegisterBtn}</Text>
          </TouchableOpacity>
        )}
      </View>

      {unregistered.length > 0 && (
        <View style={styles.expiryBanner}>
          <Text style={styles.expiryText}>{s.expiryNotice}</Text>
        </View>
      )}

      {unregistered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{s.empty}</Text>
        </View>
      ) : (
        <FlatList
          data={unregistered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}

      {/* 일괄 등록 진행 중 인터랙션 차단 */}
      {bulkLoading && (
        <View style={styles.bulkLoadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </View>
  )
}
