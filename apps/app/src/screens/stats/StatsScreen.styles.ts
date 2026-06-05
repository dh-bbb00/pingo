import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:     { flex: 1, backgroundColor: t.colors.background },
  header:        { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 0, color: t.colors.text.primary },
  mainTabBar:    { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.colors.divider, marginTop: 8 },
  mainTab:       { flex: 1, paddingVertical: 12, alignItems: 'center' },
  mainTabActive: { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  mainTabText:   { fontSize: t.fontSize.sm, color: t.colors.text.disabled, fontWeight: t.fontWeight.medium },
  mainTabTextActive: { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  subTabWrap:    { paddingTop: 12 },
  rangeRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  rangeBtn:      { flex: 1, borderRadius: t.radius.md, paddingVertical: 10, paddingHorizontal: 14 },
  rangeLabel:    { fontSize: t.fontSize.xs, marginBottom: 2 },
  rangeDate:     { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold },
  rangeSep:      { fontSize: t.fontSize.md, marginHorizontal: 8 },
})
