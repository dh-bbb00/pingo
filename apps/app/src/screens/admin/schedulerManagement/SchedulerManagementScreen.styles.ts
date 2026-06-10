import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: t.colors.background },
  topSection:   { paddingHorizontal: t.spacing.md, paddingTop: t.spacing.md },
  header:       { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, marginBottom: t.spacing.md },
  runButton:    { backgroundColor: t.colors.primary, borderRadius: t.radius.md, paddingVertical: t.spacing.md, alignItems: 'center', marginBottom: t.spacing.md },
  runButtonText:{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },

  tabBar:       { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.colors.divider, marginBottom: t.spacing.sm },
  tab:          { flex: 1, paddingVertical: t.spacing.sm, alignItems: 'center' },
  tabActive:    { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  tabText:      { fontSize: t.fontSize.sm, color: t.colors.text.secondary },
  tabTextActive:{ color: t.colors.primary, fontWeight: t.fontWeight.bold },

  listContent:  { paddingHorizontal: t.spacing.md, paddingBottom: t.spacing.xl },
  empty:        { textAlign: 'center', marginTop: t.spacing.xl, fontSize: t.fontSize.md, color: t.colors.text.secondary },
})
