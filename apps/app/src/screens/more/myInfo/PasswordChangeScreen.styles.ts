import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:  { flex: 1, padding: 24, backgroundColor: t.colors.background },
  header:     { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, marginBottom: 32, marginTop: 8, color: t.colors.text.primary },
  input:       { borderWidth: 1, borderColor: t.colors.border, borderRadius: t.radius.md, padding: 14, color: t.colors.text.primary },
  inputError:  { borderColor: t.colors.semantic.error },
  errorText:   { fontSize: t.fontSize.xs, color: t.colors.semantic.error, marginTop: 4, marginBottom: 12 },
  inputNormal: { marginBottom: 12 },
  button:     { backgroundColor: t.colors.primary, padding: 16, borderRadius: t.radius.md, alignItems: 'center', marginTop: 8 },
  buttonText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md },
})
