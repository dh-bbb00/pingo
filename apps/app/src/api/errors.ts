/** BE의 ApiErrorCode와 1:1 동기화 — 변경 시 BE도 함께 수정 */
export const ApiErrorCode = {
  INVALID_CREDENTIALS:   'INVALID_CREDENTIALS',
  PENDING_APPROVAL:      'PENDING_APPROVAL',
  REJECTED:              'REJECTED',
  NEW_DEVICE:            'NEW_DEVICE',
  DEVICE_PENDING:        'DEVICE_PENDING',
  ALREADY_APPROVED:      'ALREADY_APPROVED',
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
  errorCode: ApiErrorCode | undefined
  message: string | undefined
  status: number | undefined
}

/** Axios 에러에서 errorCode·message·status를 추출 */
export function parseApiError(error: unknown): ParsedApiError {
  const res = (error as { response?: { data?: { errorCode?: string; message?: string | string[] }; status?: number } })?.response
  const raw = res?.data?.message
  return {
    errorCode: res?.data?.errorCode as ApiErrorCode | undefined,
    message:   Array.isArray(raw) ? raw[0] : raw,
    status:    res?.status,
  }
}
