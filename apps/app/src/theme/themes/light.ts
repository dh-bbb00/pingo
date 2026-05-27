import { palette } from '../tokens/colors'
import { spacing, radius } from '../tokens/spacing'
import { fontSize, fontWeight } from '../tokens/typography'
import type { Theme } from '../types'

export const lightTheme: Theme = {
  colors: {
    primary:        palette.blue500,
    primaryLight:   palette.blue50,
    background:     palette.white,
    surface:        palette.gray50,
    surfaceVariant: palette.gray100,
    border:         palette.gray200,
    divider:        palette.gray100,
    text: {
      primary:   palette.gray900,
      secondary: palette.gray500,
      disabled:  palette.gray400,
      inverse:   palette.white,
    },
    semantic: {
      income:            palette.green500,
      expense:           palette.red500,
      warning:           palette.yellow500,
      success:           palette.green500,
      successBackground: palette.green100,
      error:             palette.red500,
      errorBackground:   palette.red100,
    },
  },
  spacing,
  radius,
  fontSize,
  fontWeight,
}
