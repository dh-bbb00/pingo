import type { spacing, radius } from './tokens/spacing'
import type { fontSize, fontWeight } from './tokens/typography'

export interface ThemeColors {
  primary:        string
  primaryLight:   string
  background:     string
  surface:        string
  /** 리스트 아이템, 중첩 카드 등 surface보다 한 단계 더 구분이 필요한 영역 */
  surfaceVariant: string
  border:         string
  divider:        string
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
    /** UI 피드백용 성공 — income(도메인)과 구분 */
    success:           string
    successBackground: string
    warningBackground: string
    /** UI 피드백용 오류 — expense(도메인)과 구분 */
    error:           string
    errorBackground: string
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
