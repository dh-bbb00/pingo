import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  pagination:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  pageBtn:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: t.radius.md, backgroundColor: t.colors.surface },
  pageBtnDisabled: { opacity: 0.35 },
  pageBtnText:     { fontSize: t.fontSize.sm, color: t.colors.text.primary, fontWeight: t.fontWeight.medium },
  pageInfo:        { flexDirection: 'row', alignItems: 'center', minWidth: 60, justifyContent: 'center' },
  pageNum:         { fontSize: t.fontSize.sm, color: t.colors.text.secondary, textAlign: 'center' },
  pageSep:         { fontSize: t.fontSize.sm, color: t.colors.text.secondary },
  pageInput:       { fontSize: t.fontSize.sm, color: t.colors.text.primary, minWidth: 32, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: t.colors.primary, paddingVertical: 2 },
})
