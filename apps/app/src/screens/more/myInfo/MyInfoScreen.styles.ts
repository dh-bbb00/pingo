import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: t.colors.background, paddingTop: 60 },
  header:       { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, padding: 20, color: t.colors.text.primary },
  section:      { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  label:        { fontSize: t.fontSize.xs, color: t.colors.text.disabled, marginBottom: 4 },
  value:        { fontSize: t.fontSize.md, color: t.colors.text.primary },
  menuItem:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  menuLabel:    { fontSize: t.fontSize.md, color: t.colors.text.primary },
  chevron:      { fontSize: t.fontSize.xl, color: t.colors.text.disabled },
  logoutButton: { margin: 20, marginTop: 'auto', padding: 16, borderRadius: t.radius.md, borderWidth: 1, borderColor: t.colors.border, alignItems: 'center' },
  logoutText:   { color: t.colors.semantic.error, fontWeight: t.fontWeight.semiBold },
})
