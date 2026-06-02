import { palette } from '../tokens/colors'
import { spacing, radius } from '../tokens/spacing'
import { fontSize, fontWeight } from '../tokens/typography'
import type { Theme } from '../types'

export const darkTheme: Theme = {
  colors: {
    primary:        palette.blue500,
    primaryLight:   palette.blue700,
    background:     palette.gray900,
    surface:        palette.gray800,
    surfaceVariant: palette.gray700,
    border:         palette.gray700,
    divider:        palette.gray800,
    text: {
      primary:   palette.white,
      secondary: palette.gray400,
      disabled:  palette.gray500,
      inverse:   palette.gray900,
    },
    semantic: {
      income:            palette.green500,
      expense:           palette.red400,
      warning:           palette.yellow500,
      success:           palette.green500,
      successBackground: palette.green900,
      warningBackground: palette.gray700,
      error:             palette.red400,
      errorBackground:   palette.red900,
    },
  },
  spacing,
  radius,
  fontSize,
  fontWeight,
}
