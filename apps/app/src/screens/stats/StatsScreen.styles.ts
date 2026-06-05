import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:     { flex: 1, backgroundColor: t.colors.background },
  header:        { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 0, color: t.colors.text.primary },
  mainTabBar:    { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.colors.divider, marginTop: 8 },
  mainTab:       { flex: 1, paddingVertical: 12, alignItems: 'center' },
  mainTabActive: { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  mainTabText:   { fontSize: t.fontSize.sm, color: t.colors.text.disabled, fontWeight: t.fontWeight.medium },
  mainTabTextActive: { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  subTabWrap:    { paddingTop: 12 },
})
