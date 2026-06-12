import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:      { flex: 1, backgroundColor: t.colors.background },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  headerTitle:    { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary },
  bulkBtn:        { fontSize: t.fontSize.sm, color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  expiryBanner:   { marginHorizontal: 16, marginBottom: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: t.colors.surfaceVariant, borderRadius: t.radius.sm },
  expiryText:     { fontSize: t.fontSize.xs, color: t.colors.text.secondary },
  empty:          { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText:      { fontSize: t.fontSize.md, color: t.colors.text.disabled },
  list:           { padding: 16, gap: 12 },
  card:           { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: 16 },
  cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardMeta:       { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  oldBadge:       { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: t.colors.semantic.errorBackground, borderRadius: t.radius.sm },
  oldBadgeText:   { fontSize: 10, color: t.colors.semantic.error, fontWeight: t.fontWeight.semiBold },
  receivedTime:   { fontSize: t.fontSize.xs, color: t.colors.text.disabled },
  registerBtn:    { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: t.colors.primary, borderRadius: t.radius.sm },
  registerBtnText:{ fontSize: t.fontSize.sm, color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold },
  row:            { flexDirection: 'row', gap: 8, marginBottom: 2 },
  label:          { fontSize: t.fontSize.xs, color: t.colors.text.disabled, width: 56 },
  value:          { flex: 1, fontSize: t.fontSize.sm, color: t.colors.text.primary },
  rawText:        { fontSize: t.fontSize.sm, color: t.colors.text.primary, lineHeight: 20 },
  unparseableText:{ fontSize: t.fontSize.xs, color: t.colors.text.disabled, marginTop: 4 },
  bulkLoadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
})
