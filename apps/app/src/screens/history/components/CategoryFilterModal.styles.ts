import { StyleSheet, Dimensions } from 'react-native'
import type { Theme } from '@/theme'

const { height: screenHeight } = Dimensions.get('window')

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },

  sheet: {
    backgroundColor: t.colors.background,
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    paddingTop: 20,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title:            { fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: t.colors.text.primary },
  clearBtn:         { fontSize: t.fontSize.sm, color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  clearBtnDisabled: { color: t.colors.text.disabled },

  listWrap: { maxHeight: screenHeight * 0.45, borderTopWidth: 1, borderBottomWidth: 1, borderColor: t.colors.divider },

  item:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: t.colors.background },
  itemSelected: { backgroundColor: t.colors.primaryLight },

  iconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon:     { fontSize: 16 },

  itemName:         { flex: 1, fontSize: t.fontSize.md, color: t.colors.text.primary },
  itemNameSelected: { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: t.radius.sm,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
  checkmark:        { color: t.colors.text.inverse, fontSize: 13, fontWeight: t.fontWeight.bold },

  loader: { paddingVertical: 20 },

  confirmBtn: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.primary,
    alignItems: 'center',
  },
  confirmText: { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.inverse },
})
