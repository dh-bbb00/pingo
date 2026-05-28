import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:  { flex: 1, backgroundColor: t.colors.background },
  header:     { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, padding: 20 },
  fab:        { position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText:    { color: t.colors.text.inverse, fontSize: 28, lineHeight: 32, includeFontPadding: false },
  empty:         { textAlign: 'center', color: t.colors.text.disabled, marginTop: 80 },
})
