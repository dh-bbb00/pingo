import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  outerRow:  { flexDirection: 'row', alignItems: 'center', marginLeft: 16, marginRight: 4, marginBottom: 6 },

  card:      { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: t.colors.surface, borderRadius: t.radius.lg },
  iconWrap:  { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconEmoji: { fontSize: 18 },
  name:      { flex: 1, fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  amount:    { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: t.colors.text.secondary },
  noAmount:  { fontSize: t.fontSize.sm, color: t.colors.text.disabled },

  statsBtn:  { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
})
