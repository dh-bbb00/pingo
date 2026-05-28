import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.background },
  header:    { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, padding: 20, color: t.colors.text.primary },
  menuItem:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  menuLabel:    { fontSize: t.fontSize.md, color: t.colors.text.primary },
  chevron:      { fontSize: t.fontSize.xl, color: t.colors.text.disabled },
  logoutButton: { paddingVertical: 18, paddingHorizontal: 20, borderTopWidth: StyleSheet.hairlineWidth, borderColor: t.colors.divider },
  logoutText:   { fontSize: t.fontSize.md, color: t.colors.semantic.error },
})
