import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  item:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  iconWrap:   { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconEmoji:  { fontSize: 18 },
  itemBody:   { flex: 1, marginRight: 8 },
  itemRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName:   { fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium, color: t.colors.text.primary, flex: 1, marginRight: 8 },
  itemAmount: { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  itemSub:    { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginTop: 2 },
})
