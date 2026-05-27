import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { parseApiError, ApiErrorCode, ParsedApiError } from './errors'

const c = strings.common

/**
 * API 에러를 errorCode 기준으로 중앙 처리.
 * 모든 화면에서 catch 블록 대신 이 함수 하나만 호출.
 *
 * - 표시 문구는 백엔드 message 를 그대로 사용.
 * - 에러코드 추가 시 이 파일 switch 에만 케이스 추가.
 * - 화면별로 특정 코드 동작을 바꿔야 할 때는 overrides 사용.
 */
export function handleApiError(
  error: unknown,
  overrides?: Partial<Record<ApiErrorCode, (parsed: ParsedApiError) => void>>,
): void {
  const parsed = parseApiError(error)
  const { errorCode, message } = parsed

  const override = errorCode ? overrides?.[errorCode] : undefined
  if (override) {
    override(parsed)
    return
  }

  switch (errorCode) {
    // 계정 or 기기 승인 대기 — 승인 대기 화면으로 이동
    // NEW_DEVICE는 useLogin에서 override로 처리 (email/password params 전달 필요)
    case ApiErrorCode.PENDING_APPROVAL:
    case ApiErrorCode.DEVICE_PENDING:
      navigationRef.navigate(Screens.Root.Auth, { screen: Screens.Auth.ApprovalPending })
      break

    // 거절된 계정 — 거절 안내 화면으로 이동
    case ApiErrorCode.REJECTED_ACCOUNT:
      navigationRef.navigate(Screens.Root.Auth, { screen: Screens.Auth.RejectedAccount })
      break

    // 네비게이션 없이 메시지만 표시하는 케이스 — 토스트
    case ApiErrorCode.INVALID_CREDENTIALS:
    case ApiErrorCode.REJECTED:
    case ApiErrorCode.ALREADY_APPROVED:
    case ApiErrorCode.RATE_LIMIT_EXCEEDED:
    case ApiErrorCode.INTERNAL_ERROR:
    case ApiErrorCode.VALIDATION_ERROR:
      Toast.show({ type: 'error', text1: message ?? c.errorFallback })
      break

    // 그 외 알 수 없는 오류 — Alert
    default:
      Alert.alert(c.errorTitle, message ?? c.errorFallback)
  }
}
