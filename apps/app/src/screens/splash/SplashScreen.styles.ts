import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', gap: 12 },
  logo:      { fontSize: 64, fontWeight: '900', color: t.colors.text.inverse },
  title:     { fontSize: t.fontSize.xxl, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse, letterSpacing: -0.5 },
})
