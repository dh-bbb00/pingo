import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: t.colors.background },
  emoji:      { fontSize: 64, marginBottom: 16 },
  title:      { fontSize: t.fontSize.xxl, fontWeight: t.fontWeight.bold, marginBottom: 12, color: t.colors.text.primary },
  desc:       { fontSize: t.fontSize.md, color: t.colors.text.secondary, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  button:     { backgroundColor: t.colors.primary, padding: 16, borderRadius: t.radius.md, paddingHorizontal: 32 },
  buttonText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md },
})
