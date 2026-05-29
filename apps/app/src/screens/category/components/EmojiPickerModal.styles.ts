import { StyleSheet, Dimensions } from 'react-native'
import type { Theme } from '@/theme'

const WIN_WIDTH  = Dimensions.get('window').width
const WIN_HEIGHT = Dimensions.get('window').height
const NUM_COLS   = 7
const CELL_SIZE  = Math.floor((WIN_WIDTH - 64) / NUM_COLS)

export { CELL_SIZE, NUM_COLS }

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet:      { height: WIN_HEIGHT * 0.3, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingHorizontal: 20, backgroundColor: t.colors.surface },
  title:      { marginBottom: 12, color: t.colors.text.primary, fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold },

  tabScroll:       { borderBottomWidth: 1, borderBottomColor: t.colors.divider, marginBottom: 8, flexGrow: 0 },
  tabContent:      { gap: 4 },
  tab:             { paddingHorizontal: 10, paddingVertical: 8 },
  tabActive:       { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  tabText:         { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.medium, color: t.colors.text.disabled },
  tabTextActive:   { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.bold, color: t.colors.primary },

  list:       { flex: 1 },
  grid:       { paddingBottom: 24 },
  cell:       { width: CELL_SIZE, height: CELL_SIZE, alignItems: 'center', justifyContent: 'center' },
  cellActive: { backgroundColor: t.colors.primaryLight, borderRadius: t.radius.sm },
  emoji:      { fontSize: 26 },
})
