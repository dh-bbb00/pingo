import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:       { flex: 1, backgroundColor: t.colors.background },
  header:          { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, padding: 20, color: t.colors.text.primary },
  section:         { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  label:           { fontSize: t.fontSize.xs, color: t.colors.text.disabled, marginBottom: 4 },
  value:           { fontSize: t.fontSize.md, color: t.colors.text.primary },
  menuItem:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  menuLabel:       { fontSize: t.fontSize.md, color: t.colors.text.primary },
  chevron:         { fontSize: t.fontSize.xl, color: t.colors.text.disabled },
  switchRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  logoutButton:    { margin: 20, marginTop: 'auto', padding: 16, borderRadius: t.radius.md, borderWidth: 1, borderColor: t.colors.border, alignItems: 'center' },
  logoutText:      { color: t.colors.semantic.error, fontWeight: t.fontWeight.semiBold },

  devicesHeader:          { fontSize: t.fontSize.xs, color: t.colors.text.disabled, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  devicesHeaderSkeleton:  { marginHorizontal: 20, marginTop: 20, marginBottom: 8 },
  deviceItem:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.colors.divider },
  deviceItemCurrent:{ flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.colors.divider, borderLeftWidth: 4, borderLeftColor: t.colors.primary },
  deviceInfo:       { flex: 1 },
  deviceName:       { fontSize: t.fontSize.md, color: t.colors.text.primary, fontWeight: t.fontWeight.semiBold },
  deviceModel:      { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginTop: 2 },
  currentBadge:     { alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 7, paddingVertical: 3, borderRadius: t.radius.sm, backgroundColor: t.colors.primary },
  currentBadgeText: { fontSize: t.fontSize.xs, color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold },
  deleteBtn:        { paddingHorizontal: 12, paddingVertical: 6 },
  deleteBtnText:    { fontSize: t.fontSize.sm, color: t.colors.semantic.error },
})
