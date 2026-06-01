import { StyleSheet, Dimensions } from 'react-native'
import type { Theme } from '@/theme'

const { height: screenHeight } = Dimensions.get('window')

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },

  sheet: {
    backgroundColor: t.colors.background,
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    paddingTop: 24,
    paddingBottom: 32,
  },

  title:    { fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, paddingHorizontal: 20, marginBottom: 16 },
  listWrap: { height: screenHeight * 0.3, borderTopWidth: 1, borderBottomWidth: 1, borderColor: t.colors.divider },

  sectionHeader: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: t.colors.surfaceVariant },
  sectionText:   { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semiBold, color: t.colors.text.secondary },

  item:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: t.colors.background },
  itemSelected: { backgroundColor: t.colors.primaryLight },
  itemName:         { flex: 1, fontSize: t.fontSize.md, color: t.colors.text.primary },
  itemNameSelected: { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  cardNumber:       { fontSize: t.fontSize.sm, color: t.colors.text.secondary },
  checkDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: t.colors.primary },

  typeTag:     { fontSize: 20, marginRight: 8 },

  loader:    { paddingVertical: 12 },
  emptyText: { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginBottom: 12 },

  noCardWrap:  { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  addCardBtn:  { paddingHorizontal: 20, paddingVertical: 8, borderRadius: t.radius.md, backgroundColor: t.colors.primary },
  addCardText: { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.inverse },

})
