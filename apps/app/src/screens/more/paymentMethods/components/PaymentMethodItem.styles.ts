import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  outerRow:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 6 },
  // 터치 가능 항목(카드): 카드 배경
  card:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: t.colors.surface, borderRadius: t.radius.lg },
  // 비활성 항목(현금·상품권): 플랫 행
  flatRow:    { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  iconWrap:   { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  iconEmoji:  { fontSize: 22 },
  info:       { flex: 1 },
  name:       { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  cardNumber: { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.regular, color: t.colors.text.secondary },
  defaultTag: { fontSize: t.fontSize.xs, color: t.colors.primary, fontWeight: t.fontWeight.medium, marginLeft: 8 },
})
