import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.background, paddingTop: 60 },
  header:    { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, padding: 20, color: t.colors.text.primary },
})
