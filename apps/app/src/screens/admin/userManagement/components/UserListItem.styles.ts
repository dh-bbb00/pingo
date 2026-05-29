import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  card:       { marginBottom: 8, overflow: 'hidden', backgroundColor: t.colors.surface, borderRadius: t.radius.lg },
  row:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  email:      { flex: 1, color: t.colors.text.primary, fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium },
  chevron:    { fontSize: 10, marginLeft: 8, color: t.colors.text.secondary },

  devices:    { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.colors.divider, paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  noDevice:   { textAlign: 'center', paddingVertical: 4, color: t.colors.text.disabled, fontSize: t.fontSize.sm },

  deviceRow:  { flexDirection: 'row', gap: 8 },
  deviceNum:  { width: 18, color: t.colors.primary, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold },
  deviceInfo: { flex: 1 },
  deviceName: { marginBottom: 2, color: t.colors.text.primary, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium },
  deviceMeta: { color: t.colors.text.secondary, fontSize: t.fontSize.xs },

  actionRow:         { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.colors.divider, paddingTop: 10, alignItems: 'flex-end' },
  actionBtn:         { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  actionBtnSuspended: { backgroundColor: t.colors.primaryLight },
  actionBtnActive:   { backgroundColor: t.colors.semantic.errorBackground },
  actionBtnText:     { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold },
  actionBtnTextSuspended: { color: t.colors.primary },
  actionBtnTextActive:    { color: t.colors.semantic.error },
})
