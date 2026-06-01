import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.background },
  scroll:    { flex: 1 },
  content:   { padding: 20, paddingBottom: 40 },

  // 총 소비 카드
  summaryCard:   { backgroundColor: t.colors.primary, borderRadius: t.radius.lg, padding: 20, marginBottom: 20 },
  summaryLabel:  { fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 6 },
  summaryAmount: { fontSize: 32, fontWeight: t.fontWeight.bold, color: '#FFFFFF', marginBottom: 4 },
  summaryDiff:   { fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.85)' },

  // 섹션
  section:      { marginBottom: 20 },
  sectionTitle: { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.secondary, marginBottom: 10 },
  card:         { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: 16 },
  emptyText:    { fontSize: t.fontSize.sm, color: t.colors.text.disabled, textAlign: 'center', paddingVertical: 12 },
  linkRow:      { alignItems: 'flex-end', paddingTop: 12 },
  linkText:     { fontSize: t.fontSize.sm, color: t.colors.primary, fontWeight: t.fontWeight.medium },

  // 예산 알림
  alertBox:       { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, overflow: 'hidden' },
  alertRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  alertRowBorder: { borderTopWidth: 1, borderTopColor: t.colors.divider },
  alertDot:       { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  alertText:      { flex: 1, fontSize: t.fontSize.sm, color: t.colors.text.primary },
  alertPct:       { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold },

  // 카테고리 바
  catRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  catDot:          { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  catDotPlaceholder: { width: 10, height: 10, marginRight: 10 },
  catBody:         { flex: 1 },
  catTopRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName:         { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: t.colors.text.primary, flex: 1, marginRight: 8 },
  catAmount:       { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  catBarTrack:     { height: 6, backgroundColor: t.colors.divider, borderRadius: 3, overflow: 'hidden' },
  catBar:          { height: 6, borderRadius: 3 },
  catBudgetHint:   { fontSize: t.fontSize.xs, color: t.colors.text.disabled, marginTop: 3, textAlign: 'right' },

  // 최근 거래
  txDivider: { height: 1, backgroundColor: t.colors.divider, marginVertical: 2 },
  txRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  txIcon:    { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txIconEmoji: { fontSize: 16 },
  txBody:    { flex: 1 },
  txMerchant:{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: t.colors.text.primary },
  txSub:     { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginTop: 2 },
  txAmount:  { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },

  // 소비 추이
  trendCard:        { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingVertical: 8 },
  trendBarWrap:     { alignItems: 'center', flex: 1 },
  trendAmountLabel: { fontSize: 10, color: t.colors.text.secondary, marginBottom: 4 },
  trendBarTrack:    { height: 80, justifyContent: 'flex-end' },
  trendBar:         { width: 24, borderRadius: 4, minHeight: 4 },
  trendLabel:       { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginTop: 6 },
})
