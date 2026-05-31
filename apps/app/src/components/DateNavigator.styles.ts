import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  // flat: HistoryScreen 스타일 (배경 없음)
  flatContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 4 },
  flatNavBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  flatArrow:     { fontSize: 28, color: t.colors.text.primary, includeFontPadding: false, lineHeight: 32 },
  flatCenter:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  flatDateText:  { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },

  // card: TransactionEditScreen 스타일 (surface 배경)
  cardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: t.colors.surface, borderRadius: t.radius.md },
  cardNavBtn:    { width: 44, height: 48, alignItems: 'center', justifyContent: 'center' },
  cardArrow:     { fontSize: 24, color: t.colors.text.primary, includeFontPadding: false, lineHeight: 28 },
  cardDateText:  { textAlign: 'center', fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium, color: t.colors.text.primary },

  // 공용
  arrowDisabled: { color: t.colors.text.disabled },
  todayBadge:    { fontSize: t.fontSize.xs, color: t.colors.primary, fontWeight: t.fontWeight.semiBold, backgroundColor: t.colors.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: t.radius.full },
})
