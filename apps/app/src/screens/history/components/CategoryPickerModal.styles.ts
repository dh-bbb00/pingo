import { StyleSheet, Dimensions } from 'react-native'

const { height: screenHeight } = Dimensions.get('window')
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },

  sheet: {
    backgroundColor: t.colors.background,
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    paddingTop: 24,
    paddingBottom: 32,
    maxHeight: '80%',
  },

  title:    { fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, paddingHorizontal: 20, marginBottom: 16 },
  listWrap: { height: screenHeight * 0.3, borderTopWidth: 1, borderBottomWidth: 1, borderColor: t.colors.divider },

  noneItem: { borderBottomWidth: 1, borderBottomColor: t.colors.divider },
  noneIcon: { backgroundColor: t.colors.surfaceVariant },

  item:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: t.colors.background },
  itemSelected: { backgroundColor: t.colors.primaryLight },

  iconWrap:         { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconEmoji:        { fontSize: 16 },
  itemName:         { flex: 1, fontSize: t.fontSize.md, color: t.colors.text.primary },
  itemNameSelected: { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  checkDot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: t.colors.primary },

  loader:    { paddingVertical: 12 },
  emptyText: { textAlign: 'center', paddingVertical: 24, fontSize: t.fontSize.sm, color: t.colors.text.secondary },

  btnRow:     { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 20 },
  btn:        { flex: 1, paddingVertical: 14, borderRadius: t.radius.md, alignItems: 'center' },
  cancelBtn:  { backgroundColor: t.colors.surfaceVariant },
  confirmBtn: { backgroundColor: t.colors.primary },
  cancelText:  { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  confirmText: { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.inverse },
})
