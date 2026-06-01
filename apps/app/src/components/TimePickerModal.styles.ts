import { Dimensions, StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const ITEM_HEIGHT = 48
export const VISIBLE     = 5
export const PAD         = Math.floor(VISIBLE / 2)

const SHEET_WIDTH = Dimensions.get('window').width - 48

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sheet:   { width: SHEET_WIDTH, backgroundColor: t.colors.background, borderRadius: t.radius.xl, paddingTop: 24, paddingBottom: 28, paddingHorizontal: 24 },

  title:   { fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, textAlign: 'center', marginBottom: 16 },

  columns: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  column:  { alignItems: 'center' },
  colon:   { fontSize: 28, fontWeight: '700', color: t.colors.text.primary, marginHorizontal: 12, marginBottom: 20 },
  unit:    { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginTop: 8, fontWeight: t.fontWeight.medium },
})
