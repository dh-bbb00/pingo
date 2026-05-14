import type { spacing, radius } from './tokens/spacing'
import type { fontSize, fontWeight } from './tokens/typography'

export interface ThemeColors {
  primary:      string
  primaryLight: string
  background:   string
  surface:      string
  border:       string
  text: {
    primary:   string
    secondary: string
    disabled:  string
    inverse:   string
  }
  semantic: {
    income:  string
    expense: string
    warning: string
  }
}

export interface Theme {
  colors:     ThemeColors
  spacing:    typeof spacing
  radius:     typeof radius
  fontSize:   typeof fontSize
  fontWeight: typeof fontWeight
}

export type ThemeMode = 'light' | 'dark'
