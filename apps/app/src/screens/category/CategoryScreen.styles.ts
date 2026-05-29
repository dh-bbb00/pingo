import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.background },

  // ── 헤더 ─────────────────────────────────────────────────────────────────────
  headerWrap: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  title:      { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, marginBottom: 20 },

  statsRow:   { flexDirection: 'row', gap: 32 },
  statLabel:  { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.medium, color: t.colors.text.secondary, marginBottom: 4 },
  statNum:     { fontSize: t.fontSize.xxl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, includeFontPadding: false },
  statSkeleton: { marginTop: 4 },

  // ── 정렬 ─────────────────────────────────────────────────────────────────────
  sortRow:        { flexDirection: 'row', gap: 20, paddingHorizontal: 20, paddingBottom: 12 },
  sortChip:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText:       { fontSize: t.fontSize.sm, color: t.colors.text.disabled, fontWeight: t.fontWeight.medium },
  sortTextActive: { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },

  // ── 리스트 ────────────────────────────────────────────────────────────────────
list:      { paddingBottom: 100 },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: t.colors.text.disabled, fontSize: t.fontSize.md },
  footer:    { paddingVertical: 20 },

  // ── FAB ──────────────────────────────────────────────────────────────────────
  fab:     { position: 'absolute', right: 24, bottom: 24, width: 52, height: 52, borderRadius: 16, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  fabText: { color: t.colors.text.inverse, fontSize: 26, lineHeight: 30, includeFontPadding: false },
})
