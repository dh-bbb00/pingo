import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:       { flex: 1, backgroundColor: t.colors.background },
  topSection:      { paddingHorizontal: t.spacing.md, paddingTop: t.spacing.md },
  header:          { fontSize: t.fontSize.xl, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, marginBottom: t.spacing.md },
  runButton:       { alignSelf: 'flex-end', backgroundColor: t.colors.primary, borderRadius: t.radius.md, paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, marginBottom: t.spacing.md },
  runButtonText:   { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },

  // 이번 달 상태 카드 행
  statusRow:       { flexDirection: 'row', gap: t.spacing.sm, marginBottom: t.spacing.md },
  statusCard:      { flex: 1, backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.sm, alignItems: 'center' },
  statusCardType:  { fontSize: t.fontSize.xs, color: t.colors.text.secondary, marginBottom: t.spacing.xs, textAlign: 'center' },
  statusBadge:     { paddingHorizontal: t.spacing.sm, paddingVertical: 2, borderRadius: t.radius.full, marginBottom: t.spacing.xs },
  statusBadgeText: { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },
  statusCount:     { fontSize: t.fontSize.xs, color: t.colors.text.secondary },

  // 월 필터
  monthFilter:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: t.spacing.md, marginBottom: t.spacing.md },
  monthBtn:        { padding: t.spacing.sm },
  monthBtnText:    { fontSize: t.fontSize.lg, color: t.colors.text.secondary },
  monthLabel:      { fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium, color: t.colors.text.primary, minWidth: 80, textAlign: 'center' },

  // 탭 바
  tabBar:          { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.colors.divider, marginBottom: t.spacing.sm },
  tab:             { flex: 1, paddingVertical: t.spacing.sm, alignItems: 'center' },
  tabActive:       { borderBottomWidth: 2, borderBottomColor: t.colors.primary },
  tabText:         { fontSize: t.fontSize.sm, color: t.colors.text.secondary },
  tabTextActive:   { color: t.colors.primary, fontWeight: t.fontWeight.bold },

  // 리스트
  listContent:     { paddingHorizontal: t.spacing.md, paddingBottom: t.spacing.xl },
  logCard:         { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.md, marginBottom: t.spacing.sm },
  logCardRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: t.spacing.xs },
  logCardType:     { fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium, color: t.colors.text.primary },
  logCardMeta:     { fontSize: t.fontSize.xs, color: t.colors.text.secondary },
  logCardBadge:    { paddingHorizontal: t.spacing.sm, paddingVertical: 2, borderRadius: t.radius.full },
  logCardBadgeText:{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.bold, color: t.colors.text.inverse },
  logCardCounts:   { fontSize: t.fontSize.xs, color: t.colors.text.secondary },

  // 미실행 카드
  notRunCard:      { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.md, marginBottom: t.spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notRunType:      { fontSize: t.fontSize.md, color: t.colors.text.primary },
  notRunBadge:     { backgroundColor: t.colors.text.disabled, paddingHorizontal: t.spacing.sm, paddingVertical: 2, borderRadius: t.radius.full },
  notRunBadgeText: { fontSize: t.fontSize.xs, color: t.colors.text.inverse },

  empty:           { textAlign: 'center', marginTop: t.spacing.xl, fontSize: t.fontSize.md, color: t.colors.text.secondary },
})
