import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: t.colors.background },
  header:       { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, padding: 20, color: t.colors.text.primary },
  actions:      { flexDirection: 'row', gap: 12, padding: 20, position: 'absolute', bottom: 40, left: 0, right: 0 },
  editButton:   { flex: 1, borderWidth: 1, borderColor: t.colors.primary, padding: 16, borderRadius: t.radius.md, alignItems: 'center' },
  editText:     { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  deleteButton: { flex: 1, backgroundColor: t.colors.semantic.error, padding: 16, borderRadius: t.radius.md, alignItems: 'center' },
  deleteText:   { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold },
})
