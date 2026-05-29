import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.background },

  title: { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },

  // 탭바
  tabBar:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  tab:           { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  tabText:       { fontSize: t.fontSize.sm, color: t.colors.text.disabled, fontWeight: t.fontWeight.medium },
  tabTextActive: { color: t.colors.primary, fontWeight: t.fontWeight.bold },

  // 날짜 네비
  dateNav:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 4 },
  navBtn:          { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  navArrow:        { fontSize: 28, color: t.colors.text.primary, includeFontPadding: false, lineHeight: 32 },
  navArrowDisabled:{ color: t.colors.text.disabled },
  dateCenter:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dateText:        { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  todayBadge:      { fontSize: t.fontSize.xs, color: t.colors.primary, fontWeight: t.fontWeight.semiBold, backgroundColor: t.colors.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: t.radius.full },

  // 요약
  summaryRow:    { paddingHorizontal: 20, paddingVertical: 8, marginBottom: 4 },
  summaryAmount: { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: t.colors.text.secondary },

  // 리스트
  list:     { paddingBottom: 100 },
  divider:  { height: 1, backgroundColor: t.colors.divider, marginLeft: 70 },
  emptyWrap:{ alignItems: 'center', paddingTop: 80 },
  empty:    { color: t.colors.text.disabled, fontSize: t.fontSize.md },
  footer:   { paddingVertical: 16 },

  // FAB
  fab:     { position: 'absolute', right: 24, bottom: 24, width: 52, height: 52, borderRadius: 16, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  fabText: { color: t.colors.text.inverse, fontSize: 26, lineHeight: 30, includeFontPadding: false },
})
