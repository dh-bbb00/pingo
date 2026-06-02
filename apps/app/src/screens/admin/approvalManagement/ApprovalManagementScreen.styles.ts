import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:      { flex: 1, backgroundColor: t.colors.background },
  headerRow:      { flexDirection: 'row', alignItems: 'baseline', gap: 8, padding: 20, paddingTop: 60, paddingBottom: 0 },
  header:         { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold },
  count:          { fontSize: t.fontSize.sm, color: t.colors.text.secondary },

  tabBar:         { flexDirection: 'row', marginHorizontal: 20, marginTop: 16, borderRadius: t.radius.md, backgroundColor: t.colors.surfaceVariant, padding: 4 },
  tab:            { flex: 1, paddingVertical: 8, borderRadius: t.radius.sm, alignItems: 'center' },
  tabActive:      { backgroundColor: t.colors.surface },
  tabText:        { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: t.colors.text.secondary },
  tabTextActive:  { color: t.colors.text.primary, fontWeight: t.fontWeight.semiBold },

  list:           { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  empty:          { textAlign: 'center', color: t.colors.text.disabled, marginTop: 80 },

  card:           { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: 16, marginBottom: 12 },
  cardHeader:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  email:          { flex: 1, fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  badge:          { paddingHorizontal: 7, paddingVertical: 2, borderRadius: t.radius.sm },
  badgeNew:       { backgroundColor: t.colors.primaryLight },
  badgeDevice:    { backgroundColor: t.colors.surfaceVariant },
  badgeText:      { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semiBold },
  badgeNewText:   { color: t.colors.primary },
  badgeDeviceText:{ color: t.colors.text.secondary },
  meta:           { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginBottom: 2 },
  actions:        { flexDirection: 'row', gap: 8, marginTop: 12 },
  button:         { flex: 1, paddingVertical: 10, borderRadius: t.radius.md, alignItems: 'center' },
  approveButton:  { backgroundColor: t.colors.primary },
  rejectButton:   { backgroundColor: t.colors.text.disabled },
  acceptButton:   { backgroundColor: t.colors.primary },
  deleteButton:   { backgroundColor: t.colors.semantic.error },
  buttonText:     { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.sm },
})
