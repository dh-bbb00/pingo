import React, { useEffect, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { HistoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { Screens } from '@/constants/screens'
import { useCancelNotificationStore } from '@/store/cancelNotificationStore'
import { useNotificationLogStore } from '@/store/notificationLogStore'
import { parseCancelNotification, parseCardNotification, parsePaymentNotification } from '@/utils/cardNotificationParser'
import { useCancelledTransactionSearch, matchesCancelInfo, merchantIncludes } from './hooks/useCancelledTransactionSearch'
import type { Transaction } from '@/api/endpoints/transactions.api'
import type { DetectedNotification } from '@/store/notificationLogStore'
import { makeStyles } from './CancelledTransactionSearchScreen.styles'

type Route = RouteProp<HistoryStackParamList, 'CancelledTransactionSearch'>
type Nav   = NativeStackNavigationProp<HistoryStackParamList, 'CancelledTransactionSearch'>

const s = strings.cancelledTransactionSearch

export default function CancelledTransactionSearchScreen() {
  const { theme } = useTheme()
  const styles    = useMemo(() => makeStyles(theme), [theme])

  const { params }    = useRoute<Route>()
  const navigation    = useNavigation<Nav>()
  const cancelStore   = useCancelNotificationStore()
  const pendingStore  = useNotificationLogStore()

  useEffect(() => {
    cancelStore.load()
    pendingStore.load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cancelNotification = cancelStore.notifications.find(n => n.id === params.cancelNotificationId)
  const parsed = cancelNotification
    ? (parseCancelNotification(cancelNotification.title, cancelNotification.text)
       ?? parsePaymentNotification(cancelNotification.title, cancelNotification.text))
    : null

  const { data: dbMatches, isLoading } = useCancelledTransactionSearch(parsed)

  // 미등록 알림 중 매칭 항목 — 가맹점명·금액·결제유형 일치
  const pendingMatches = useMemo(() => {
    if (!parsed) return []
    return pendingStore.notifications.filter(n => {
      const p = parseCardNotification(n.title, n.text) ?? parsePaymentNotification(n.title, n.text)
      if (!p) return false
      if (!merchantIncludes(p.merchant, parsed.merchant)) return false
      if (p.isInstallment !== parsed.isInstallment) return false
      if (p.amount !== parsed.amount) return false
      return true
    })
  }, [parsed, pendingStore.notifications])

  function handleSelectDbTransaction(tx: Transaction) {
    navigation.navigate(Screens.History.TransactionEdit, { id: tx.id })
  }

  function handleSelectPending(notification: DetectedNotification) {
    Alert.alert(s.removePendingTitle, s.removePendingMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      {
        text: s.removePendingOk,
        style: 'destructive',
        onPress: () => pendingStore.markAsRegistered(notification.id),
      },
    ])
  }

  function formatPayType(isInstallment: boolean, installmentMonths: number | null): string {
    if (!isInstallment) return s.lumpSum
    if (installmentMonths != null) return s.installmentFmt(installmentMonths)
    return s.installmentUnknown
  }

  function formatTxPayType(tx: Transaction): string {
    const months = tx.installmentMonths
    if (months == null || months < 2) return s.lumpSum
    return s.installmentFmt(months)
  }

  function formatTxAmount(tx: Transaction): string {
    const amount = tx.totalAmount ?? tx.amount
    return `${amount.toLocaleString()}원`
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  const hasResults = (dbMatches?.length ?? 0) > 0 || pendingMatches.length > 0

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── 취소 감지 내역 배너 ── */}
      {parsed && (
        <View style={styles.cancelBanner}>
          <Text style={styles.cancelBannerTitle}>{s.cancelInfoTitle}</Text>
          {([
            { label: s.merchant, value: parsed.merchant },
            { label: s.amount,   value: parsed.amountStr },
            { label: s.payType,  value: formatPayType(parsed.isInstallment, parsed.installmentMonths) },
            { label: s.issuer,   value: `${parsed.issuer} (${parsed.last4})` },
            { label: s.date,     value: `${parsed.date} ${parsed.time}` },
          ] as const).map(({ label, value }) => (
            <View key={label} style={styles.cancelRow}>
              <Text style={styles.cancelLabel}>{label}</Text>
              <Text style={styles.cancelValue}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── 빈 상태 ── */}
      {!isLoading && !hasResults && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{s.notFound}</Text>
          <Text style={styles.emptyHint}>{s.notFoundHint}</Text>
        </View>
      )}

      {/* ── 등록된 내역 섹션 ── */}
      {(dbMatches?.length ?? 0) > 0 && (
        <>
          <Text style={styles.sectionTitle}>{s.sectionDb}</Text>
          {dbMatches!.map(tx => (
            <TouchableOpacity
              key={tx.id}
              style={styles.card}
              onPress={() => handleSelectDbTransaction(tx)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.merchantName} numberOfLines={1}>{tx.merchantName}</Text>
                <Text style={styles.amount}>{formatTxAmount(tx)}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
              {([
                { label: s.payType, value: formatTxPayType(tx) },
                { label: s.date,    value: new Date(tx.transactionDate).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) },
                ...(tx.category ? [{ label: '카테고리', value: `${tx.category.icon ?? ''} ${tx.category.name}` }] : []),
              ] as const).map(({ label, value }) => (
                <View key={label} style={styles.row}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{value}</Text>
                </View>
              ))}
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* ── 미등록 알림 섹션 ── */}
      {pendingMatches.length > 0 && (
        <>
          {(dbMatches?.length ?? 0) > 0 && <View style={styles.sectionGap} />}
          <Text style={styles.sectionTitle}>{s.sectionPending}</Text>
          {pendingMatches.map(n => {
            const p = parseCardNotification(n.title, n.text)!
            return (
              <TouchableOpacity
                key={n.id}
                style={styles.card}
                onPress={() => handleSelectPending(n)}
                activeOpacity={0.7}
              >
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>{s.sectionPending}</Text>
                </View>
                <View style={styles.cardHeader}>
                  <Text style={styles.merchantName} numberOfLines={1}>{p.merchant}</Text>
                  <Text style={styles.amount}>{p.amountStr}</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
                {([
                  { label: s.payType, value: formatPayType(p.isInstallment, p.installmentMonths) },
                  { label: s.date,    value: `${p.date} ${p.time}` },
                  { label: s.issuer,  value: `${p.issuer} (${p.last4})` },
                ] as const).map(({ label, value }) => (
                  <View key={label} style={styles.row}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>{value}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            )
          })}
        </>
      )}

    </ScrollView>
  )
}
