import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', gap: 12 },
  logo:      { width: 120, height: 120, borderRadius: 28 },
  title:     { fontSize: t.fontSize.xxl, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse, letterSpacing: -0.5 },
})
