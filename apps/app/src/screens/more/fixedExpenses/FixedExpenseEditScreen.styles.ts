import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:   { flex: 1, backgroundColor: t.colors.background },
  scroll:      { flex: 1 },
  content:     { padding: 24, paddingBottom: 40 },
  screenTitle: { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, marginBottom: 28 },

  gap:      { height: 20 },
  label:    { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginBottom: 8, fontWeight: t.fontWeight.medium },

  input:      { backgroundColor: t.colors.surface, borderRadius: t.radius.md, paddingHorizontal: 16, paddingVertical: 14, fontSize: t.fontSize.md, color: t.colors.text.primary },
  inputError: { borderWidth: 1, borderColor: t.colors.semantic.error },
  memoInput:  { minHeight: 80, textAlignVertical: 'top' },
  errorText:  { fontSize: t.fontSize.xs, color: t.colors.semantic.error, marginTop: 6 },

  amountRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: t.colors.surface, borderRadius: t.radius.md, paddingHorizontal: 16 },
  amountInput: { flex: 1, paddingVertical: 14, fontSize: t.fontSize.lg, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  amountUnit:  { fontSize: t.fontSize.md, color: t.colors.text.secondary, marginLeft: 4 },

  pickerRow:         { flexDirection: 'row', alignItems: 'center', backgroundColor: t.colors.surface, borderRadius: t.radius.md, paddingHorizontal: 16, paddingVertical: 14 },
  pickerText:        { flex: 1, fontSize: t.fontSize.md, color: t.colors.text.primary },
  pickerPlaceholder: { color: t.colors.text.disabled },
  pickerChevron:     { fontSize: 22, color: t.colors.text.disabled, lineHeight: 26 },
  pickerIconWrap:    { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  pickerIconEmoji:   { fontSize: 14 },

  switchRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: t.colors.surface, borderRadius: t.radius.md, paddingHorizontal: 16, paddingVertical: 14 },
  switchLabel:  { flex: 1, fontSize: t.fontSize.md, color: t.colors.text.primary },
  switchSub:    { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginTop: 2 },

  submitBtn:     { backgroundColor: t.colors.primary, borderRadius: t.radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  submitBtnText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md },
  deleteBtn:     { borderRadius: t.radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  deleteBtnText: { color: t.colors.semantic.error, fontWeight: t.fontWeight.medium, fontSize: t.fontSize.md },
  btnDisabled:   { opacity: 0.5 },
})
