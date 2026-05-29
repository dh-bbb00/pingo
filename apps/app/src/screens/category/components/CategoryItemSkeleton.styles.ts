import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  outerRow:  { flexDirection: 'row', alignItems: 'center', marginLeft: 16, marginRight: 4, marginBottom: 6 },
  card:      { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, backgroundColor: t.colors.surface, borderRadius: t.radius.lg },
  iconGap:   { marginRight: 12 },
  textGroup: { flex: 1 },
  nameLine:  { marginBottom: 7 },
  statsIcon: { marginHorizontal: 10 },
})
