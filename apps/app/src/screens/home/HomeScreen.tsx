import React, { useMemo } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { UserTabParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { Screens } from '@/constants/screens'
import { useHomeSummary } from './hooks/useHomeSummary'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { makeStyles } from './HomeScreen.styles'
import type { HomeSummaryCategory, HomeSummaryTransaction } from '@/api/endpoints/stats.api'
import { DATE_TAB } from '@/api/endpoints/stats.api'

type Nav = BottomTabNavigationProp<UserTabParamList, 'Home'>

const s    = strings.home
const TOP_N = 3

function fmtShort(n: number): string {
  if (n === 0) return '0'
  if (n >= 100_000_000) return `${Math.floor(n / 10_000_000) / 10}억`
  if (n >= 10_000)      return `${Math.floor(n / 1_000) / 10}만`
  return `${Math.floor(n / 100) / 10}천`
}
// 예산 경고 임계값
const WARN_PCT  = 80
const OVER_PCT  = 100

export default function HomeScreen() {
  const { theme } = useTheme()
  const styles    = useMemo(() => makeStyles(theme), [theme])
  const navigation = useNavigation<Nav>()

  const { data, isLoading, refetch } = useHomeSummary()
  const { refreshing, onRefresh } = usePullToRefresh(refetch)

  const now   = new Date()
  const month = now.getMonth() + 1

  // 카테고리 TOP N + 기타
  const topCats   = data?.byCategory.slice(0, TOP_N) ?? []
  const otherCats = data?.byCategory.slice(TOP_N) ?? []
  const otherSum  = otherCats.reduce((s, c) => s + c.amount, 0)
  const maxAmount = topCats[0]?.amount ?? 1

  // 예산 알림 — budget이 있고 pct >= WARN_PCT인 항목
  const budgetAlerts = (data?.byCategory ?? []).filter(c => {
    if (!c.budget || c.budget <= 0) return false
    return (c.amount / c.budget) * 100 >= WARN_PCT
  })

  // 전월 대비 문구
  const diff = (data?.thisMonthTotal ?? 0) - (data?.lastMonthTotal ?? 0)
  const vsLastMonth = data == null ? '' :
    data.lastMonthTotal === 0 ? s.noLastMonth :
    diff > 0 ? s.vsMoreFmt(diff) :
    diff < 0 ? s.vsLessFmt(Math.abs(diff)) :
    s.vsSame

  // 추이 차트 — 최대값 기준 bar 높이 계산
  const trend    = data?.monthlyTrend ?? []
  const maxTrend = Math.max(...trend.map(t => t.amount), 1)

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} color={theme.colors.primary} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
      >
        {/* ── 이번달 총 소비 ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{s.totalLabel}</Text>
          <Text style={styles.summaryAmount}>
            {(data?.thisMonthTotal ?? 0).toLocaleString()}원
          </Text>
          {vsLastMonth !== '' && (
            <Text style={[
              styles.summaryDiff,
              diff > 0 && { color: theme.colors.semantic.error },
              diff < 0 && { color: theme.colors.semantic.income },
            ]}>
              {vsLastMonth}
            </Text>
          )}
        </View>

        {/* ── 예산 알림 (위험 항목 있을 때만) ── */}
        {budgetAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{s.budgetAlertTitle}</Text>
            <View style={styles.alertList}>
              {budgetAlerts.map((item, idx) => {
                const pct  = Math.round((item.amount / item.budget!) * 100)
                const over = pct >= OVER_PCT
                const name = item.category?.name ?? s.noCategory
                const color = over ? theme.colors.semantic.error : theme.colors.semantic.warning
                const bg    = over ? theme.colors.semantic.errorBackground : theme.colors.semantic.warningBackground
                return (
                  <TouchableOpacity
                    key={item.category?.id ?? idx}
                    style={[styles.alertRow, { backgroundColor: bg, borderLeftColor: color }]}
                    onPress={() => navigation.navigate(Screens.UserTab.Stats as any, {
                      initialTab: 'category',
                      dateTab:    DATE_TAB.MONTH,
                      categoryId: item.category?.id,
                    })}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.alertIcon}>{over ? '🚨' : '⚠️'}</Text>
                    <View style={styles.alertBody}>
                      <Text style={styles.alertName}>{name}</Text>
                      <Text style={styles.alertDesc}>
                        {over ? s.budgetOverFmt(name) : s.budgetNearFmt(name, pct)}
                      </Text>
                    </View>
                    <Text style={[styles.alertPct, { color }]}>{pct}%</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        )}

        {/* ── 카테고리별 소비 TOP ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{s.categoryTopTitle}</Text>
          <View style={styles.card}>
            {topCats.length === 0 ? (
              <Text style={styles.emptyText}>{s.noData}</Text>
            ) : (
              <>
                {topCats.map(item => (
                  <CategoryBar
                    key={item.category?.id ?? 'null'}
                    item={item}
                    maxAmount={maxAmount}
                    styles={styles}
                    theme={theme}
                  />
                ))}

                {otherCats.length > 0 && (
                  <View style={styles.catRow}>
                    <View style={styles.catDotPlaceholder} />
                    <Text style={[styles.catName, { color: theme.colors.text.secondary }]}>
                      {s.categoryOthersFmt(otherCats.length)}
                    </Text>
                    <Text style={styles.catAmount}>
                      {otherSum.toLocaleString()}원
                    </Text>
                  </View>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => navigation.navigate(Screens.UserTab.Stats as any, { initialTab: 'category', dateTab: DATE_TAB.DAY })}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>{s.toStats}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 최근 거래내역 ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{s.recentTitle}</Text>
          <View style={styles.card}>
            {(data?.recentTransactions ?? []).length === 0 ? (
              <Text style={styles.emptyText}>{s.noData}</Text>
            ) : (
              data!.recentTransactions.map((tx, idx) => (
                <RecentTxRow
                  key={tx.id}
                  tx={tx}
                  showDivider={idx > 0}
                  styles={styles}
                  theme={theme}
                />
              ))
            )}
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => navigation.navigate(Screens.UserTab.History as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>{s.toHistory}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 소비 추이 (6개월) ── */}
        {trend.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{s.trendTitle}</Text>
            <View style={[styles.card, styles.trendCard]}>
              {trend.map((item, idx) => {
                const monthNum  = new Date(item.month).getMonth() + 1
                const barH      = Math.max(Math.round((item.amount / maxTrend) * 80), 4)
                const isCurrent = monthNum === month
                return (
                  <View key={idx} style={styles.trendBarWrap}>
                    <Text style={[styles.trendAmountLabel, isCurrent && { color: theme.colors.primary }]}>
                      {fmtShort(item.amount)}
                    </Text>
                    <View style={styles.trendBarTrack}>
                      <View
                        style={[
                          styles.trendBar,
                          { height: barH, backgroundColor: isCurrent ? theme.colors.primary : theme.colors.primaryLight },
                        ]}
                      />
                    </View>
                    <Text style={[styles.trendLabel, isCurrent && { color: theme.colors.primary, fontWeight: theme.fontWeight.semiBold }]}>
                      {s.trendMonthFmt(monthNum)}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

// ── 인라인 서브 컴포넌트 ──

function CategoryBar({
  item, maxAmount, styles, theme,
}: {
  item: HomeSummaryCategory
  maxAmount: number
  styles: ReturnType<typeof import('./HomeScreen.styles').makeStyles>
  theme: any
}) {
  const budgetPct = item.budget ? (item.amount / item.budget) * 100 : null
  const isOver    = budgetPct !== null && budgetPct >= OVER_PCT

  // 예산 있으면 예산 대비(초과 시 100% 고정), 없으면 최대 카테고리 대비
  const barRatio = item.budget
    ? Math.min(item.amount / item.budget, 1)
    : item.amount / maxAmount

  const catColor = item.category?.color ?? theme.colors.primary
  const barColor = (budgetPct !== null && budgetPct >= WARN_PCT && !isOver)
    ? theme.colors.semantic.warning
    : catColor

  // 초과 시: 트랙 100% 안에서 예산분(catColor) + 초과분(error) 비율로 분할
  const budgetSegPct  = isOver ? Math.round((item.budget! / item.amount) * 100) : 0
  const overSegPct    = isOver ? 100 - budgetSegPct : 0

  return (
    <View style={styles.catRow}>
      <View style={[styles.catDot, { backgroundColor: item.category?.color ?? theme.colors.surfaceVariant }]} />
      <View style={styles.catBody}>
        <View style={styles.catTopRow}>
          <Text style={styles.catName} numberOfLines={1}>{item.category?.name ?? s.noCategory}</Text>
          <Text style={styles.catAmount}>{item.amount.toLocaleString()}원</Text>
        </View>
        <View style={styles.catBarTrack}>
          {isOver ? (
            <>
              <View style={[styles.catBar, { width: `${budgetSegPct}%`, backgroundColor: catColor }]} />
              <View style={[styles.catBar, { width: `${overSegPct}%`, backgroundColor: theme.colors.semantic.error }]} />
            </>
          ) : (
            <View style={[styles.catBar, { width: `${Math.round(barRatio * 100)}%`, backgroundColor: barColor }]} />
          )}
        </View>
        {budgetPct !== null && (
          <Text style={[styles.catBudgetHint, isOver && { color: theme.colors.semantic.error }]}>
            {Math.round(budgetPct)}%
          </Text>
        )}
      </View>
    </View>
  )
}

function RecentTxRow({
  tx, showDivider, styles, theme,
}: {
  tx: HomeSummaryTransaction
  showDivider: boolean
  styles: ReturnType<typeof import('./HomeScreen.styles').makeStyles>
  theme: any
}) {
  const d = new Date(tx.transactionDate)
  const dateStr = `${d.getMonth() + 1}.${d.getDate()}`

  return (
    <>
      {showDivider && <View style={styles.txDivider} />}
      <View style={styles.txRow}>
        <View style={[styles.txIcon, { backgroundColor: tx.category?.color ?? theme.colors.surfaceVariant }]}>
          <Text style={styles.txIconEmoji}>{tx.category?.icon ?? '•'}</Text>
        </View>
        <View style={styles.txBody}>
          <Text style={styles.txMerchant} numberOfLines={1}>{tx.merchantName}</Text>
          <Text style={styles.txSub}>{dateStr}  {tx.category?.name ?? strings.home.noCategory}</Text>
        </View>
        <Text style={styles.txAmount}>{tx.amount.toLocaleString()}원</Text>
      </View>
    </>
  )
}
