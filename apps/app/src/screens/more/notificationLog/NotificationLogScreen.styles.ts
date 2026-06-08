import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:   { flex: 1, backgroundColor: t.colors.background },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title:       { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary },
  clearBtn:    { fontSize: t.fontSize.sm, color: t.colors.semantic.error },
  empty:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText:   { fontSize: t.fontSize.md, color: t.colors.text.disabled },
  list:        { padding: 16, gap: 12 },
  card:        { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: 16, gap: 6 },
  row:         { flexDirection: 'row', gap: 8 },
  label:       { fontSize: t.fontSize.xs, color: t.colors.text.disabled, width: 60 },
  value:       { flex: 1, fontSize: t.fontSize.sm, color: t.colors.text.primary },
  titleText:   { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  rawBox:      { backgroundColor: t.colors.surfaceVariant, borderRadius: t.radius.sm, padding: 10, marginTop: 4 },
  rawText:     { fontSize: 10, color: t.colors.text.secondary, fontFamily: 'monospace' },
})
