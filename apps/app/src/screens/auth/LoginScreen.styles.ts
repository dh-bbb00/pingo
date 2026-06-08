import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:  { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: t.colors.background },
  title:      { fontSize: t.fontSize.xxl, fontWeight: t.fontWeight.bold, marginBottom: 32, color: t.colors.text.primary },
  input:      { borderWidth: 1, borderColor: t.colors.border, borderRadius: t.radius.md, padding: 14, marginBottom: 12, color: t.colors.text.primary },
  options:     { flexDirection: 'row', gap: 16, marginBottom: 12 },
  optionLabel: { fontSize: t.fontSize.sm, color: t.colors.text.secondary },
  row:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button:     { backgroundColor: t.colors.primary, padding: 16, borderRadius: t.radius.md, alignItems: 'center', marginTop: 16 },
  buttonText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md },
  link:       { textAlign: 'center', color: t.colors.text.secondary, marginTop: 16 },
})
