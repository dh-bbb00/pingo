import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: t.colors.surface },
  rowFirst: { borderTopLeftRadius: t.radius.lg, borderTopRightRadius: t.radius.lg },
  rowLast:  { borderBottomLeftRadius: t.radius.lg, borderBottomRightRadius: t.radius.lg },

  iconWrap:  { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  iconEmoji: { fontSize: 20 },

  name:     { flex: 1, fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.primary },
  amount:   { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: t.colors.text.secondary },
  noAmount: { fontSize: t.fontSize.sm, color: t.colors.text.disabled },

  // ── separator — 아이콘 오른쪽에서 시작하는 구분선
  sepWrap:  { marginHorizontal: 16, backgroundColor: t.colors.surface },
  sepLine:  { height: StyleSheet.hairlineWidth, backgroundColor: t.colors.divider, marginLeft: 70 },
})
