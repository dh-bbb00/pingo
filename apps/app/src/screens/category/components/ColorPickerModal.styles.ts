import { StyleSheet, Dimensions } from 'react-native'
import type { Theme } from '@/theme'

const WIN_WIDTH = Dimensions.get('window').width
export const COLOR_PICKER_BOX_SIZE = WIN_WIDTH - 64
export const COLOR_PICKER_HUE_H    = 26
export const COLOR_PICKER_DOT_SIZE = 22
export const COLOR_PICKER_HUE_DOT  = 26

export const makeStyles = (t: Theme) => StyleSheet.create({
  overlay:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet:      { padding: 24, width: WIN_WIDTH - 32, alignItems: 'center', backgroundColor: t.colors.surface, borderRadius: t.radius.xl },
  title:      { alignSelf: 'flex-start', marginBottom: 16, color: t.colors.text.primary, fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold },

  boxWrap:    { position: 'relative', width: COLOR_PICKER_BOX_SIZE, height: COLOR_PICKER_BOX_SIZE, borderRadius: 6, overflow: 'hidden' },
  dot:        { position: 'absolute', width: COLOR_PICKER_DOT_SIZE, height: COLOR_PICKER_DOT_SIZE, borderRadius: COLOR_PICKER_DOT_SIZE / 2, borderWidth: 2.5, borderColor: '#fff' },

  hueWrap:    { position: 'relative', width: COLOR_PICKER_BOX_SIZE, height: COLOR_PICKER_HUE_H, marginTop: 16 },
  hueDot:     { position: 'absolute', width: COLOR_PICKER_HUE_DOT, height: COLOR_PICKER_HUE_DOT, borderRadius: COLOR_PICKER_HUE_DOT / 2, top: (COLOR_PICKER_HUE_H - COLOR_PICKER_HUE_DOT) / 2, borderWidth: 2.5, borderColor: '#fff', elevation: 2 },

  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'stretch', marginTop: 16 },
  preview:    { width: 44, height: 44, borderRadius: t.radius.md },
  hexWrap:    { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 44, backgroundColor: t.colors.background, borderRadius: t.radius.md },
  hexHash:    { marginRight: 2, color: t.colors.text.disabled, fontSize: t.fontSize.md },
  hexInput:   { flex: 1, color: t.colors.text.primary, fontSize: t.fontSize.md },

  btn:        { alignSelf: 'stretch', paddingVertical: 14, alignItems: 'center', marginTop: 20, backgroundColor: t.colors.primary, borderRadius: t.radius.md },
  btnText:    { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md },
})
