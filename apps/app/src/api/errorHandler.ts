import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'
import { navigationRef } from '@/navigation/navigationRef'
import { strings } from '@/constants/strings'
import { parseApiError, ApiErrorCode } from './errors'

const s = strings.toast
const e = strings.error

/**
 * API 에러를 errorCode 기준으로 중앙 처리.
 * 모든 화면에서 catch 블록 대신 이 함수 하나만 호출.
 *
 * 에러코드 추가 시 이 파일 switch에만 케이스 추가하면 됨.
 */
export function handleApiError(error: unknown): void {
  const { errorCode, message } = parseApiError(error)

  switch (errorCode) {
    // 신규 기기 — 기기변경 화면으로 이동
    case ApiErrorCode.NEW_DEVICE:
      navigationRef.navigate('Auth', { screen: 'DeviceChange' })
      break

    // 계정 or 기기 승인 대기 — 승인 대기 화면으로 이동
    case ApiErrorCode.PENDING_APPROVAL:
    case ApiErrorCode.DEVICE_PENDING:
      navigationRef.navigate('Auth', { screen: 'ApprovalPending' })
      break

    // 잘못된 자격증명 — 미등록 사용자 안내 토스트
    case ApiErrorCode.INVALID_CREDENTIALS:
      Toast.show({ type: 'error', text1: s.unregisteredUser, text2: s.pleaseRequestApproval })
      break

    // 승인 거절
    case ApiErrorCode.REJECTED:
      Toast.show({ type: 'error', text1: s.rejected })
      break

    // 이미 승인된 계정 (승인요청 중복)
    case ApiErrorCode.ALREADY_APPROVED:
      Toast.show({ type: 'error', text1: s.alreadyApproved })
      break

    // 요청 횟수 초과
    case ApiErrorCode.RATE_LIMIT_EXCEEDED:
      Toast.show({ type: 'error', text1: s.rateLimitExceeded })
      break

    // 서버 내부 오류
    case ApiErrorCode.INTERNAL_ERROR:
      Toast.show({ type: 'error', text1: s.serverError })
      break

    // 그 외 (유효성 오류 등) — 서버 메시지 그대로 Alert
    default:
      Alert.alert(e.title, message ?? e.fallback)
  }
}
