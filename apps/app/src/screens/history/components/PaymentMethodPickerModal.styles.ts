import { StyleSheet, Dimensions } from 'react-native'
import type { Theme } from '@/theme'

const { height: screenHeight } = Dimensions.get('window')

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },

  sheet: {
    backgroundColor: t.colors.background,
    borderTopLeftRadius: t.radius.xl,
    borderTopRightRadius: t.radius.xl,
    paddingTop: 24,
    paddingBottom: 32,
  },

  // single 모드: 제목만
  title: { fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: t.colors.text.primary, paddingHorizontal: 20, marginBottom: 16 },

  // multi 모드: 제목 + 전체 버튼
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  clearBtn:        { fontSize: t.fontSize.sm, color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  clearBtnDisabled:{ color: t.colors.text.disabled },

  listWrap: { maxHeight: screenHeight * 0.35, borderTopWidth: 1, borderBottomWidth: 1, borderColor: t.colors.divider },

  sectionHeader: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: t.colors.surfaceVariant },
  sectionText:   { fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semiBold, color: t.colors.text.secondary },

  item:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 13, backgroundColor: t.colors.background },
  itemSelected:     { backgroundColor: t.colors.primaryLight },
  itemName:         { flex: 1, fontSize: t.fontSize.md, color: t.colors.text.primary },
  itemNameSelected: { color: t.colors.primary, fontWeight: t.fontWeight.semiBold },
  cardNumber:       { fontSize: t.fontSize.sm, color: t.colors.text.secondary },
  typeTag:          { fontSize: 20, marginRight: 10 },

  // single 모드 선택 표시
  checkDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: t.colors.primary },

  // multi 모드 체크박스
  checkbox: {
    width: 22, height: 22, borderRadius: t.radius.sm,
    borderWidth: 1.5, borderColor: t.colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
  checkmark:        { color: t.colors.text.inverse, fontSize: 13, fontWeight: t.fontWeight.bold },

  loader:    { paddingVertical: 12 },
  emptyText: { fontSize: t.fontSize.sm, color: t.colors.text.secondary, marginBottom: 12 },

  noCardWrap:  { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  addCardBtn:  { paddingHorizontal: 20, paddingVertical: 8, borderRadius: t.radius.md, backgroundColor: t.colors.primary },
  addCardText: { fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold, color: t.colors.text.inverse },

  // multi 모드 확인 버튼
  confirmBtn:  { marginHorizontal: 20, marginTop: 16, paddingVertical: 14, borderRadius: t.radius.md, backgroundColor: t.colors.primary, alignItems: 'center' },
  confirmText: { fontSize: t.fontSize.md, fontWeight: t.fontWeight.semiBold, color: t.colors.text.inverse },
})
