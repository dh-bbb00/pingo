import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:   { flex: 1, backgroundColor: t.colors.background },
  scrollContent:{ paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.md },

  card:        { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: t.spacing.md, marginBottom: t.spacing.md },

  row:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: t.spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.colors.divider },
  lastRow:     { borderBottomWidth: 0 },
  label:       { fontSize: t.fontSize.sm, color: t.colors.text.secondary, flex: 1 },
  value:       { fontSize: t.fontSize.sm, color: t.colors.text.primary, flex: 2, textAlign: 'right' },

  badge:       { paddingHorizontal: t.spacing.sm, paddingVertical: 2, borderRadius: t.radius.full },
  badgeText:   { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },

  errorBox:    { backgroundColor: t.colors.semantic.errorBackground, borderRadius: t.radius.md, padding: t.spacing.md, marginTop: t.spacing.sm },
  errorText:   { fontSize: t.fontSize.sm, color: t.colors.semantic.error },

  notRunCard:  { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: t.spacing.md, marginBottom: t.spacing.md, alignItems: 'center' },
  notRunText:  { fontSize: t.fontSize.md, color: t.colors.text.secondary, marginTop: t.spacing.sm },

  runButtonWrapper: { paddingHorizontal: t.spacing.md, paddingBottom: t.spacing.lg, paddingTop: t.spacing.sm },
  runButton:        { backgroundColor: t.colors.primary, borderRadius: t.radius.md, paddingVertical: t.spacing.md, alignItems: 'center' },
  runButtonText:    { fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },
})
