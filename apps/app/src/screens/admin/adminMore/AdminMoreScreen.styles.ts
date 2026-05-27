import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: t.colors.background, paddingHorizontal: 20, paddingTop: 24 },
  header:       { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, marginBottom: 32 },
  logoutButton: { paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: t.colors.border },
  logoutText:   { fontSize: t.fontSize.md, color: t.colors.semantic.error },
})
