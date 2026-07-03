import notifee, { AndroidImportance, AndroidStyle, TriggerType } from '@notifee/react-native'
import type { TimestampTrigger } from '@notifee/react-native'
import { strings } from '@/constants/strings'

export const CHANNEL_ID = 'pingo-default'

const FIXED_EXPENSE_PREFIX = 'fixed-expense-'
const REMINDER_DELAY_MS    = 3 * 24 * 60 * 60 * 1000  // 3일

// 발송 예정 날짜(YYYYMMDD)를 ID에 포함 — 같은 날 여러 알림이 생겨도 예약이 덮어써져서 1개만 발송된다.
function reminderIdForTimestamp(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `pending-reminder-${y}${m}${day}`
}

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
  const body = sn.detectedBodyFmt(app, text)
  await notifee.displayNotification({
    title: sn.detectedTitle,
    body,
    data:  { notificationId },
    android: {
      channelId:   CHANNEL_ID,
      pressAction: { id: 'pending-notifications', launchActivity: 'default' },
      style: { type: AndroidStyle.BIGTEXT, text: body },
    },
  })
}

/**
 * 알림 저장 시점에 3일 뒤 예약 알림을 등록하고 reminderId를 반환한다.
 * ID에 발송 예정 날짜를 포함하므로, 같은 날 여러 알림이 감지돼도 예약이 덮어써져 1개만 발송된다.
 * Notifee TimestampTrigger는 내부적으로 Android AlarmManager를 사용하므로
 * 앱이 완전히 종료된 상태에서도 OS가 직접 발송 — AppState와 무관하게 동작한다.
 */
export async function schedulePendingReminder(): Promise<string> {
  const remindAt  = Date.now() + REMINDER_DELAY_MS
  const reminderId = reminderIdForTimestamp(remindAt)
  const trigger: TimestampTrigger = {
    type:      TriggerType.TIMESTAMP,
    timestamp: remindAt,
  }
  await notifee.createTriggerNotification(
    {
      id:    reminderId,
      title: sn.reminderTitle,
      body:  sn.reminderBody,
      android: {
        channelId:   CHANNEL_ID,
        pressAction: { id: 'pending-notifications', launchActivity: 'default' },
      },
    },
    trigger,
  )
  return reminderId
}

/**
 * 카드 취소 감지 알림 표시 — 탭 시 원 거래 내역 찾기 화면으로 이동
 */
export async function displayCancelNotification(app: string, text: string, cancelNotificationId: string) {
  const body = sc.notification.detectedBodyFmt(app, text)
  await notifee.displayNotification({
    title: sc.notification.detectedTitle,
    body,
    data:  { cancelNotificationId },
    android: {
      channelId:   CHANNEL_ID,
      pressAction: { id: 'cancel-notification', launchActivity: 'default' },
      style: { type: AndroidStyle.BIGTEXT, text: body },
    },
  })
}

/**
 * 내역 등록 완료 시 해당 예약 알림을 취소한다.
 * 같은 reminderId를 공유하는 미등록 알림이 남아있으면 호출하지 않아야 한다.
 * 이미 발송됐거나 AlarmManager에 등록되지 않은 경우 notifee가 예외를 던지므로 무시한다.
 */
export async function cancelPendingReminder(reminderId: string) {
  try {
    await notifee.cancelTriggerNotification(reminderId)
  } catch {
    // 이미 발송됐거나 등록된 적 없는 경우
  }
}

/**
 * dayOfMonth 기준으로 다음 발송 시각을 계산한다.
 * 당월 해당일 9시가 아직 지나지 않았으면 이번 달, 지났으면 다음 달로 예약한다.
 */
function nextFixedExpenseAt9AM(dayOfMonth: number): number {
  const now       = new Date()
  const candidate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth, 9, 0, 0, 0)
  if (candidate.getTime() > Date.now()) return candidate.getTime()
  // 이번 달 9시가 이미 지난 경우 → 다음 달 동일 일자
  return new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth, 9, 0, 0, 0).getTime()
}

/** 고정 지출 당일 9시 알림 예약. 앱 시작마다 재호출해 매월 연속성을 유지한다. */
export async function scheduleFixedExpenseReminder(id: string, dayOfMonth: number, merchantName: string) {
  const trigger: TimestampTrigger = {
    type:      TriggerType.TIMESTAMP,
    timestamp: nextFixedExpenseAt9AM(dayOfMonth),
  }
  await notifee.createTriggerNotification(
    {
      id:    `${FIXED_EXPENSE_PREFIX}${id}`,
      title: sn.fixedExpenseTitle,
      body:  sn.fixedExpenseBody(merchantName),
      android: {
        channelId:   CHANNEL_ID,
        pressAction: { id: 'default' },
      },
    },
    trigger,
  )
}

/** 고정 지출 알림 취소. 삭제하거나 비활성화할 때 호출한다. */
export async function cancelFixedExpenseReminder(id: string) {
  try {
    await notifee.cancelTriggerNotification(`${FIXED_EXPENSE_PREFIX}${id}`)
  } catch {
    // 이미 발송됐거나 등록된 적 없는 경우
  }
}

/**
 * 앱 시작 시 활성 고정 지출 알림을 전체 동기화한다.
 * TimestampTrigger는 1회 발송 후 소멸하므로, 매 앱 시작마다 다음 달 일자로 재예약해야 한다.
 */
export async function syncFixedExpenseReminders(
  items: { id: string; dayOfMonth: number; merchantName: string; isActive: boolean }[],
) {
  await Promise.all(
    items.map(item =>
      item.isActive
        ? scheduleFixedExpenseReminder(item.id, item.dayOfMonth, item.merchantName)
        : cancelFixedExpenseReminder(item.id),
    ),
  )
}
