import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: t.colors.background },
  headerRow:    { flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12 },
  header:       { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary },
  count:        { fontSize: t.fontSize.sm, color: t.colors.text.secondary },

  searchWrap:   { marginHorizontal: 20, marginBottom: 12, borderRadius: t.radius.md, backgroundColor: t.colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  searchInput:  { flex: 1, paddingVertical: 10, fontSize: t.fontSize.sm, color: t.colors.text.primary },
  searchClear:  { padding: 4 },
  searchClearText: { fontSize: t.fontSize.sm, color: t.colors.text.disabled },

  list:         { paddingHorizontal: 20, paddingBottom: 16 },
  empty:        { textAlign: 'center', color: t.colors.text.disabled, marginTop: 80 },
})
