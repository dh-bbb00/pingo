import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:  { flex: 1, backgroundColor: t.colors.background },
  header:     { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, padding: 20 },
  fab:        { position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText:    { color: t.colors.text.inverse, fontSize: 28, lineHeight: 32, includeFontPadding: false },
  tabBar:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  tab:           { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  tabText:       { color: t.colors.text.disabled, fontWeight: t.fontWeight.medium },
  tabTextActive: { color: t.colors.primary, fontWeight: t.fontWeight.bold },
  empty:         { textAlign: 'center', color: t.colors.text.disabled, marginTop: 80 },
})
