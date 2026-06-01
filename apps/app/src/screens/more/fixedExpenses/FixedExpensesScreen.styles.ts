import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:   { flex: 1, backgroundColor: t.colors.background },
  header:      { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },

  list:        { paddingBottom: 100 },
  divider:     { height: 1, backgroundColor: t.colors.divider, marginLeft: 72 },
  emptyWrap:   { alignItems: 'center', paddingTop: 80 },
  empty:       { color: t.colors.text.disabled, fontSize: t.fontSize.md },

  item:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  categoryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  itemBody:    { flex: 1, marginRight: 8 },
  itemRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName:    { fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium, color: t.colors.text.primary, flex: 1, marginRight: 8 },
  itemAmount:  { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  itemSub:     { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginTop: 2 },

  fab:         { position: 'absolute', right: 24, bottom: 24, width: 52, height: 52, borderRadius: 16, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  fabText:     { color: t.colors.text.inverse, fontSize: 26, lineHeight: 30, includeFontPadding: false },
})
