import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  groupHeader:  { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.secondary, paddingVertical: t.spacing.sm },
  card:         { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.md, marginBottom: t.spacing.sm },
  cardRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: t.spacing.xs },
  cardType:     { fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium, color: t.colors.text.primary },
  cardMeta:     { fontSize: t.fontSize.xs, color: t.colors.text.secondary },
  cardBadge:    { paddingHorizontal: t.spacing.sm, paddingVertical: 2, borderRadius: t.radius.full },
  cardBadgeText:{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },
  cardCounts:   { fontSize: t.fontSize.xs, color: t.colors.text.secondary },
  notRunCard:   { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.md, marginBottom: t.spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notRunType:   { fontSize: t.fontSize.md, color: t.colors.text.primary },
  notRunBadge:  { backgroundColor: t.colors.text.disabled, paddingHorizontal: t.spacing.sm, paddingVertical: 2, borderRadius: t.radius.full },
  notRunBadgeText: { fontSize: t.fontSize.xs, color: t.colors.text.inverse },
})
