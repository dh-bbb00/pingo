import { StyleSheet } from 'react-native'


import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:     { flex: 1, backgroundColor: t.colors.background },
  headerRow:     { flexDirection: 'row', alignItems: 'baseline', gap: 8, padding: 20, paddingTop: 60 },
  header:        { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold },
  count:         { fontSize: t.fontSize.sm, color: t.colors.text.secondary },
  loader:        { marginTop: 80 },
  list:          { paddingHorizontal: 20, paddingBottom: 40 },
  empty:         { textAlign: 'center', color: t.colors.text.disabled, marginTop: 80 },
  card:          { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: 16, marginBottom: 12 },
  email:         { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary, marginBottom: 4 },
  meta:          { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginBottom: 2 },
  actions:       { flexDirection: 'row', gap: 8, marginTop: 12 },
  button:        { flex: 1, paddingVertical: 10, borderRadius: t.radius.md, alignItems: 'center' },
  approveButton: { backgroundColor: t.colors.primary },
  rejectButton:  { backgroundColor: t.colors.text.disabled },
  buttonText:    { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.sm },
})
