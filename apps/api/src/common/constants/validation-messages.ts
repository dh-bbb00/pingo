/**
 * class-validator 데코레이터 한글 메시지 상수.
 * 데코레이터의 { message } 옵션에 사용.
 */
export const VM = {
  string:      '문자열을 입력해주세요.',
  notEmpty:    '필수 입력 항목입니다.',
  email:       '올바른 이메일 형식이 아닙니다.',
  minLength:   (n: number) => `${n}자 이상 입력해주세요.`,
  number:      '숫자를 입력해주세요.',
  boolean:     'true 또는 false 값이어야 합니다.',
  dateString:  '날짜 형식이 올바르지 않습니다. (ISO 8601)',
  min:         (n: number) => `${n} 이상의 값을 입력해주세요.`,
  max:         (n: number) => `${n} 이하의 값을 입력해주세요.`,
  invalid:     '유효하지 않은 값입니다.',
} as const
