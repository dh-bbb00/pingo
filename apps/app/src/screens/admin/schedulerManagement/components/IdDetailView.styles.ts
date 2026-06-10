import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:        { flex: 1, backgroundColor: t.colors.background },
  scrollContent:    { paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.md },
  runButtonWrapper: { paddingHorizontal: t.spacing.md, paddingBottom: t.spacing.lg, paddingTop: t.spacing.sm },
  runButton:        { backgroundColor: t.colors.primary, borderRadius: t.radius.md, paddingVertical: t.spacing.md, alignItems: 'center' },
  runButtonText:    { fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },
})
