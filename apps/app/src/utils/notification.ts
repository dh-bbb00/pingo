import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native'
import type { TimestampTrigger } from '@notifee/react-native'
import { strings } from '@/constants/strings'

export const CHANNEL_ID = 'pingo-default'

// 예약 알림 id를 `${prefix}${notificationId}` 형태로 만들어, 등록 완료 시 정확한 알림만 취소할 수 있게 한다.
const REMINDER_PREFIX   = 'pending-reminder-'
const REMINDER_DELAY_MS = 3 * 24 * 60 * 60 * 1000  // 3일

const sn = strings.notification
const sc = strings.cancelledTransactionSearch

/** 앱 시작 시 최초 1회 호출 — 알림 채널이 없으면 표시가 안 되므로 앱 마운트 직후 보장 */
export async function setupNotificationChannel() {
  await notifee.createChannel({
    id:         CHANNEL_ID,
    name:       sn.channelName,
    importance: AndroidImportance.HIGH,
  })
}

export async function displayNotification(title: string, body: string) {
  await notifee.displayNotification({
    title,
    body,
    android: { channelId: CHANNEL_ID, pressAction: { id: 'default' } },
  })
}

/**
 * 카드 결제 알림을 감지했을 때 사용자에게 즉시 알림 표시.
 * data.notificationId를 함께 실어서, 탭 시 App.tsx가 어떤 알림인지 식별하고
 * TransactionEditScreen으로 직접 이동할 수 있게 한다.
 */
export async function displayDetectedNotification(app: string, text: string, notificationId: string) {
  await notifee.displayNotification({
    title: sn.detectedTitle,
    body:  sn.detectedBodyFmt(app, text),
    data:  { notificationId },
    android: {
      channelId:   CHANNEL_ID,
      pressAction: { id: 'pending-notifications', launchActivity: 'default' },
    },
  })
}

/**
 * 알림 저장 시점에 3일 뒤 예약 알림을 등록한다.
 * Notifee TimestampTrigger는 내부적으로 Android AlarmManager를 사용하므로
 * 앱이 완전히 종료된 상태에서도 OS가 직접 발송 — AppState와 무관하게 동작한다.
 * 등록 완료 시 cancelPendingReminder로 반드시 취소해야 불필요한 알림을 막을 수 있다.
 */
export async function schedulePendingReminder(notificationId: string) {
  const trigger: TimestampTrigger = {
    type:      TriggerType.TIMESTAMP,
    timestamp: Date.now() + REMINDER_DELAY_MS,
  }
  await notifee.createTriggerNotification(
    {
      id:    `${REMINDER_PREFIX}${notificationId}`,
      title: sn.reminderTitle,
      body:  sn.reminderBody,
      android: {
        channelId:   CHANNEL_ID,
        pressAction: { id: 'pending-notifications', launchActivity: 'default' },
      },
    },
    trigger,
  )
}

/**
 * 카드 취소 감지 알림 표시 — 탭 시 원 거래 내역 찾기 화면으로 이동
 */
export async function displayCancelNotification(app: string, text: string, cancelNotificationId: string) {
  await notifee.displayNotification({
    title: sc.notification.detectedTitle,
    body:  sc.notification.detectedBodyFmt(app, text),
    data:  { cancelNotificationId },
    android: {
      channelId:   CHANNEL_ID,
      pressAction: { id: 'cancel-notification', launchActivity: 'default' },
    },
  })
}

/**
 * 내역 등록 완료 시 해당 알림의 예약 알림을 취소한다.
 * 이미 발송됐거나 AlarmManager에 등록되지 않은 경우 notifee가 예외를 던지므로 무시한다.
 */
export async function cancelPendingReminder(notificationId: string) {
  try {
    await notifee.cancelTriggerNotification(`${REMINDER_PREFIX}${notificationId}`)
  } catch {
    // 이미 발송됐거나 등록된 적 없는 경우
  }
}
