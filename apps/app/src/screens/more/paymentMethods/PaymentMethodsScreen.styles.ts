import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.background },
  header:    { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, padding: 20, paddingBottom: 16 },

  list:      { paddingTop: 8, paddingBottom: 100 },
  divider:   { height: 1, backgroundColor: t.colors.divider, marginHorizontal: 16, marginVertical: 8 },

  emptyWrap: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: t.fontSize.md, color: t.colors.text.secondary },

  fab:     { position: 'absolute', right: 20, bottom: 32, width: 52, height: 52, borderRadius: 26, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { fontSize: 28, color: t.colors.text.inverse, lineHeight: 32, includeFontPadding: false },
})
