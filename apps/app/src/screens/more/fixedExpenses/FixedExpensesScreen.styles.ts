import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:     { flex: 1, backgroundColor: t.colors.background },
  headerRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  header:        { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary },
  addButton:     { backgroundColor: t.colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: t.radius.md },
  addButtonText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold },
  tabBar:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  tab:           { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  tabText:       { color: t.colors.text.disabled, fontWeight: t.fontWeight.medium },
  tabTextActive: { color: t.colors.primary, fontWeight: t.fontWeight.bold },
  empty:         { textAlign: 'center', color: t.colors.text.disabled, marginTop: 80 },
})
