import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:      { flex: 1, backgroundColor: t.colors.background },
  scroll:         { flex: 1 },
  content:        { padding: 24, paddingBottom: 40 },
  screenTitle:    { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, marginBottom: 28 },

  previewSection: { alignItems: 'center', marginBottom: 28 },
  previewGap:     { marginBottom: 16 },
  pickerRow:      { flexDirection: 'row', gap: 12 },

  labelGap:   { marginBottom: 8 },
  fieldGap:   { marginBottom: 4 },
  sectionGap: { height: 20 },
  submitGap:  { marginTop: 32 },
})
