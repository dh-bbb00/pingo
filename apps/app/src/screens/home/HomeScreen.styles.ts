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
  alertList:      { gap: 8 },
  alertRow:       { flexDirection: 'row', alignItems: 'center', borderRadius: t.radius.md, paddingVertical: 10, paddingHorizontal: 14, borderLeftWidth: 4 },
  alertIcon:      { fontSize: 18, marginRight: 10 },
  alertBody:      { flex: 1 },
  alertName:      { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  alertDesc:      { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginTop: 2 },
  alertPct:       { fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold },

  // 카테고리 바
  catRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  catIcon:           { fontSize: 18, width: 26, marginRight: 8, textAlign: 'center' },
  catDotPlaceholder: { width: 26, marginRight: 8 },
  catBody:         { flex: 1 },
  catTopRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName:         { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: t.colors.text.primary, flex: 1, marginRight: 8 },
  catAmount:       { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  catBarTrack:     { height: 6, backgroundColor: t.colors.divider, borderRadius: 3, overflow: 'hidden', flexDirection: 'row' },
  catBar:          { height: 6, borderRadius: 3 },
  catBudgetHint:   { fontSize: t.fontSize.xs, color: t.colors.text.disabled, marginTop: 4, textAlign: 'right' },

  // 최근 거래
  txDivider:   { height: 1, backgroundColor: t.colors.divider, marginVertical: 2 },
  txRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  txIcon:      { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txIconEmoji: { fontSize: 16 },
  txBody:      { flex: 1 },
  txMerchant:  { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: t.colors.text.primary },
  txSub:       { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginTop: 2 },
  txAmount:    { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  txTooltip:     { marginBottom: 2, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, backgroundColor: t.colors.surfaceVariant },
  txTooltipText: { fontSize: t.fontSize.xs, color: t.colors.text.secondary, lineHeight: 16 },

  // 소비 추이
  trendCard:        { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingVertical: 8 },
  trendBarWrap:     { alignItems: 'center', flex: 1 },
  trendAmountLabel: { fontSize: 10, color: t.colors.text.secondary, marginBottom: 4 },
  trendBarTrack:    { height: 80, justifyContent: 'flex-end' },
  trendBar:         { width: 24, borderRadius: 4, minHeight: 4 },
  trendLabel:       { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginTop: 6 },
})
