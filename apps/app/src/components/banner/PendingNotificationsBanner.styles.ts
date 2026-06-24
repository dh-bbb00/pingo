import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme, topInset: number) =>
  StyleSheet.create({
    banner: {
      backgroundColor:   t.colors.primary,
      paddingTop:        topInset + 10,
      paddingBottom:     10,
      paddingHorizontal: 16,
    },
    text: {
      color:      t.colors.text.inverse,
      fontSize:   t.fontSize.sm,
      fontWeight: t.fontWeight.semiBold,
      textAlign:  'center',
    },
  })
