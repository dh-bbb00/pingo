import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme, topInset: number) =>
  StyleSheet.create({
    banner: {
      position:          'absolute',
      top:               topInset,
      left:              0,
      right:             0,
      backgroundColor:   t.colors.primary,
      paddingVertical:   10,
      paddingHorizontal: 16,
      zIndex:            9999,
    },
    text: {
      color:      t.colors.text.inverse,
      fontSize:   t.fontSize.sm,
      fontWeight: t.fontWeight.semiBold,
      textAlign:  'center',
    },
  })
