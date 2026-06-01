import { Dimensions, StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

const SHEET_WIDTH = Dimensions.get('window').width - 48

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sheet:   { width: SHEET_WIDTH, backgroundColor: t.colors.background, borderRadius: t.radius.xl, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },

  header:    { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  navBtn:    { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  arrow:     { fontSize: 28, color: t.colors.text.primary, includeFontPadding: false, lineHeight: 32 },
  yearLabel: { flex: 1, textAlign: 'center', fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, color: t.colors.text.primary },

  // 3열 × 4행
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '33.33%', alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },

  monthCircle:         { width: 60, height: 36, borderRadius: t.radius.md, alignItems: 'center', justifyContent: 'center' },
  monthCircleSelected: { backgroundColor: t.colors.primary },
  monthCircleToday:    { borderWidth: 1.5, borderColor: t.colors.primary },
  monthText:           { fontSize: t.fontSize.sm, color: t.colors.text.primary },
  monthTextSelected:   { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold },
  monthTextToday:      { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
})
