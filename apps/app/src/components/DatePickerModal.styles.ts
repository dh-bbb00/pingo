import { Dimensions, StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

const SHEET_WIDTH = Dimensions.get('window').width - 48
const CELL_SIZE   = Math.floor((SHEET_WIDTH - 40) / 7)

export const TIME_ITEM_H  = 36
export const TIME_VISIBLE = 3
export const TIME_PAD     = Math.floor(TIME_VISIBLE / 2)  // 1

export { CELL_SIZE }

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sheet:   { width: SHEET_WIDTH, backgroundColor: t.colors.background, borderRadius: t.radius.xl, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },

  // 월 헤더
  header:      { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  monthBtn:    { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  monthArrow:  { fontSize: 28, color: t.colors.text.primary, includeFontPadding: false, lineHeight: 32 },
  monthLabel:  { flex: 1, textAlign: 'center', fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, color: t.colors.text.primary },

  // 요일 헤더
  weekRow:  { flexDirection: 'row', marginBottom: 4 },
  weekday:  { width: CELL_SIZE, textAlign: 'center', fontSize: t.fontSize.xs, color: t.colors.text.disabled, fontWeight: t.fontWeight.medium, paddingVertical: 4 },

  // 날짜 그리드
  grid:               { flexDirection: 'row', flexWrap: 'wrap' },
  cell:               { width: CELL_SIZE, height: CELL_SIZE, alignItems: 'center', justifyContent: 'center' },
  dayCircle:          { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayCircleSelected:  { backgroundColor: t.colors.primary },
  dayCircleToday:     { borderWidth: 1.5, borderColor: t.colors.primary },
  dayText:            { fontSize: t.fontSize.sm, color: t.colors.text.primary },
  dayTextSelected:    { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold },
  dayTextToday:       { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },

  // 시간 피커
  timeDivider: { height: 1, backgroundColor: t.colors.divider, marginTop: 16, marginBottom: 12, marginHorizontal: -20 },
  timeRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  timeColon:   { fontSize: 24, fontWeight: '700', color: t.colors.text.primary, marginHorizontal: 8 },
})
