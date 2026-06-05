import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.background },
  scroll:    { flex: 1 },
  content:   { padding: 24, paddingBottom: 40 },
  title:     { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, marginBottom: 28 },

  gap:          { height: 20 },
  labelRow:     { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 8 },
  label:        { fontSize: t.fontSize.sm, color: t.colors.text.secondary, fontWeight: t.fontWeight.medium },
  labelSuffix:  { fontSize: t.fontSize.xs, color: t.colors.text.disabled },

  input:      { backgroundColor: t.colors.surface, borderRadius: t.radius.md, paddingHorizontal: 16, paddingVertical: 14, fontSize: t.fontSize.md, color: t.colors.text.primary },
  inputError: { borderWidth: 1, borderColor: t.colors.semantic.error },
  errorText:  { fontSize: t.fontSize.xs, color: t.colors.semantic.error, marginTop: 6 },

  toggleRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: t.colors.surface, borderRadius: t.radius.md, paddingHorizontal: 16, paddingVertical: 14 },
  toggleLabel:      { fontSize: t.fontSize.md, color: t.colors.text.primary },
  checkbox:         { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: t.colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive:   { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
  checkmark:        { color: t.colors.text.inverse, fontSize: 13, fontWeight: t.fontWeight.bold, lineHeight: 16 },

  submitBtn:     { backgroundColor: t.colors.primary, borderRadius: t.radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  submitBtnText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md },
  deleteBtn:     { borderRadius: t.radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  deleteBtnText: { color: t.colors.semantic.error, fontWeight: t.fontWeight.medium, fontSize: t.fontSize.md },
  btnDisabled:   { opacity: 0.5 },
})
