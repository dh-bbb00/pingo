import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:  { backgroundColor: t.colors.background },
  title:      { fontSize: t.fontSize.xxl, fontWeight: t.fontWeight.bold, marginBottom: 8, color: t.colors.text.primary },
  desc:       { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginBottom: 32 },
  input:      { borderWidth: 1, borderColor: t.colors.border, borderRadius: t.radius.md, padding: 14, marginBottom: 12, color: t.colors.text.primary },
  button:     { backgroundColor: t.colors.primary, padding: 16, borderRadius: t.radius.md, alignItems: 'center', marginTop: 16 },
  buttonText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md },
})
