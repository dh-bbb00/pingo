import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:     { flex: 1, backgroundColor: t.colors.background },
  header:        { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, padding: 20, color: t.colors.text.primary },
  tabBar:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  tab:           { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  tabText:       { color: t.colors.text.disabled, fontWeight: t.fontWeight.medium },
  tabTextActive: { color: t.colors.primary, fontWeight: t.fontWeight.bold },
  content:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder:   { color: t.colors.text.disabled },
})
