import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  sectionTitle: { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.secondary, marginBottom: t.spacing.sm },
  row:          { flexDirection: 'row', gap: t.spacing.sm, marginBottom: t.spacing.md },
  card:         { flex: 1, backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.sm, alignItems: 'center' },
  cardType:     { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginBottom: t.spacing.xs, textAlign: 'center' },
  badge:        { paddingHorizontal: t.spacing.sm, paddingVertical: 2, borderRadius: t.radius.full, marginBottom: t.spacing.xs },
  badgeText:    { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },
  count:        { fontSize: t.fontSize.xs, color: t.colors.text.secondary },
})
