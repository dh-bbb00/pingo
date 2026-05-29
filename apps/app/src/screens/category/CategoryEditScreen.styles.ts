import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:       { flex: 1, backgroundColor: t.colors.background },
  scroll:          { flex: 1 },
  content:         { padding: 24, paddingBottom: 40 },
  screenTitle:     { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, marginBottom: 28 },

  // Preview
  previewSection:  { alignItems: 'center', marginBottom: 28 },
  previewCircle:   { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 16, elevation: 2 },
  previewEmoji:    { fontSize: 44, lineHeight: 56 },
  pickerRow:       { flexDirection: 'row', gap: 12 },
  pickerBtn:       { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: t.radius.md, backgroundColor: t.colors.surface },
  pickerBtnText:   { fontSize: t.fontSize.sm, color: t.colors.text.primary, fontWeight: t.fontWeight.medium },
  pickerIcon:      { fontSize: t.fontSize.lg },
  colorSwatch:     { width: 18, height: 18, borderRadius: 9 },

  // Toggle active variants (isSuspended 등 런타임 상태에 따른 색상)
  toggleLabelDisabled: { color: t.colors.text.disabled },
  toggleBtnOn:         { backgroundColor: t.colors.primary },
  toggleBtnOff:        { backgroundColor: t.colors.border },
  toggleThumbOn:       { alignSelf: 'flex-end' as const },
  toggleThumbOff:      { alignSelf: 'flex-start' as const },

  // Form
  sectionGap:      { height: 20 },
  label:           { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginBottom: 8, fontWeight: t.fontWeight.medium },
  input:           { backgroundColor: t.colors.surface, borderRadius: t.radius.md, paddingHorizontal: 16, paddingVertical: 14, fontSize: t.fontSize.md, color: t.colors.text.primary },
  inputError:      { borderWidth: 1, borderColor: t.colors.semantic.error },
  errorText:       { fontSize: t.fontSize.xs, color: t.colors.semantic.error, marginTop: 6 },

  // Budget hint
  hintText:        { fontSize: t.fontSize.xs, color: t.colors.text.disabled, marginTop: 8, lineHeight: 18 },

  // Fixed budget toggle row
  toggleRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: 16 },
  toggleLeft:      { flex: 1 },
  toggleLabel:     { fontSize: t.fontSize.md, color: t.colors.text.primary, fontWeight: t.fontWeight.medium, marginBottom: 2 },
  toggleDesc:      { fontSize: t.fontSize.xs, color: t.colors.text.disabled },
  toggleBtn:       { width: 48, height: 28, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 3 },
  toggleThumb:     { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', elevation: 2 },

  // Submit
  submitBtn:         { backgroundColor: t.colors.primary, borderRadius: t.radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  submitBtnText:     { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md },
  submitBtnDisabled: { opacity: 0.5 },

  // Delete
  deleteBtn:     { borderRadius: t.radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  deleteBtnText: { color: t.colors.semantic.error, fontWeight: t.fontWeight.medium, fontSize: t.fontSize.md },
})
