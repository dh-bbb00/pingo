/** BE의 ApiErrorCode와 1:1 동기화 — 변경 시 BE도 함께 수정 */
export const ApiErrorCode = {
  INVALID_CREDENTIALS:   'INVALID_CREDENTIALS',
  PENDING_APPROVAL:      'PENDING_APPROVAL',
  REJECTED:              'REJECTED',
  NEW_DEVICE:            'NEW_DEVICE',
  DEVICE_PENDING:        'DEVICE_PENDING',
  ALREADY_APPROVED:      'ALREADY_APPROVED',
  REJECTED_ACCOUNT:      'REJECTED_ACCOUNT',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  RATE_LIMIT_EXCEEDED:   'RATE_LIMIT_EXCEEDED',
  VALIDATION_ERROR:      'VALIDATION_ERROR',
  UNAUTHORIZED:          'UNAUTHORIZED',
  FORBIDDEN:             'FORBIDDEN',
  NOT_FOUND:             'NOT_FOUND',
  INTERNAL_ERROR:        'INTERNAL_ERROR',
} as const

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode]

export interface ParsedApiError {
  errorCode:         ApiErrorCode | undefined
  message:           string | undefined
  status:            number | undefined
  /** NEW_DEVICE 에러 시 포함 — 기기 승인 요청에만 사용하는 임시 토큰 */
  deviceAccessToken: string | undefined
}

/** Axios 에러에서 errorCode·message·status·deviceAccessToken을 추출 */
export function parseApiError(error: unknown): ParsedApiError {
  const res = (error as { response?: { data?: { errorCode?: string; message?: string | string[]; deviceAccessToken?: string }; status?: number } })?.response
  const raw = res?.data?.message
  return {
    errorCode:         res?.data?.errorCode as ApiErrorCode | undefined,
    message:           Array.isArray(raw) ? raw[0] : raw,
    status:            res?.status,
    deviceAccessToken: res?.data?.deviceAccessToken,
  }
}
