import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: t.colors.background },
  scroll:       { flex: 1 },
  content:      { padding: 16, paddingBottom: 32 },

  // 취소 감지 내역 배너
  cancelBanner: {
    backgroundColor: t.colors.semantic.errorBackground,
    borderRadius: t.radius.md,
    padding: 16,
    marginBottom: 20,
  },
  cancelBannerTitle:  { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semiBold, color: t.colors.semantic.error, marginBottom: 10 },
  cancelRow:          { flexDirection: 'row', gap: 8, marginBottom: 3 },
  cancelLabel:        { fontSize: t.fontSize.xs, color: t.colors.semantic.error, opacity: 0.7, width: 56 },
  cancelValue:        { flex: 1, fontSize: t.fontSize.sm, color: t.colors.semantic.error, fontWeight: t.fontWeight.semiBold },

  // 섹션
  sectionTitle:   { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.secondary, marginBottom: 8 },
  sectionGap:     { height: 20 },

  // 내역 카드
  card:           { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: 16, marginBottom: 10 },
  cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  merchantName:   { flex: 1, fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  amount:         { fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, color: t.colors.text.primary },
  row:            { flexDirection: 'row', gap: 8, marginBottom: 2 },
  label:          { fontSize: t.fontSize.xs, color: t.colors.text.disabled, width: 52 },
  value:          { flex: 1, fontSize: t.fontSize.sm, color: t.colors.text.secondary },
  chevron:        { fontSize: 18, color: t.colors.text.disabled, marginLeft: 8, alignSelf: 'center' },

  // 미등록 배지
  pendingBadge:     { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: t.colors.semantic.errorBackground, borderRadius: t.radius.sm, alignSelf: 'flex-start', marginBottom: 8 },
  pendingBadgeText: { fontSize: 10, color: t.colors.semantic.error, fontWeight: t.fontWeight.semiBold },

  // 빈 상태
  empty:      { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary, marginBottom: 6 },
  emptyHint:  { fontSize: t.fontSize.sm, color: t.colors.text.disabled, textAlign: 'center' },

  loader:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
