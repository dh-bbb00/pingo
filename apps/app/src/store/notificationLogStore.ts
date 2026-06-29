import { create } from 'zustand'
import { storage, StorageKeys } from '@/utils/storage'
import { cancelPendingReminder } from '@/utils/notification'

const EXPIRY_MS    = 7 * 24 * 60 * 60 * 1000  // 7일
const OLD_BADGE_MS = 3 * 24 * 60 * 60 * 1000  // 3일 이상이면 등록 유도

export interface DetectedNotification {
  id:         string
  reminderId: string  // 예약 알림 ID — 같은 날 감지된 알림끼리 공유해 예약 중복을 방지
  app:        string
  title:      string
  text:       string
  time:       string  // 감지 시각 (ms 문자열)
  raw:        string
}

interface NotificationLogStore {
  notifications:    DetectedNotification[]
  load:             () => void
  clear:            () => void
  markAsRegistered: (id: string) => void
}

function filterExpired(list: DetectedNotification[]): DetectedNotification[] {
  const now = Date.now()
  return list.filter(item => {
    const t = parseInt(item.time, 10)
    return isNaN(t) || now - t < EXPIRY_MS
  })
}

export function isOldUnregistered(notification: DetectedNotification): boolean {
  const t = parseInt(notification.time, 10)
  return !isNaN(t) && Date.now() - t >= OLD_BADGE_MS
}

export const useNotificationLogStore = create<NotificationLogStore>((set, get) => ({
  notifications: [],

  load: () => {
    const raw = storage.getString(StorageKeys.DETECTED_NOTIFICATIONS)
    const list: DetectedNotification[] = raw ? JSON.parse(raw) : []
    const valid = filterExpired(list)
    if (valid.length !== list.length) {
      storage.set(StorageKeys.DETECTED_NOTIFICATIONS, JSON.stringify(valid))
    }
    set({ notifications: valid })
  },

  clear: () => {
    storage.remove(StorageKeys.DETECTED_NOTIFICATIONS)
    set({ notifications: [] })
  },

  markAsRegistered: (id: string) => {
    const target  = get().notifications.find(n => n.id === id)
    const updated = get().notifications.filter(n => n.id !== id)
    storage.set(StorageKeys.DETECTED_NOTIFICATIONS, JSON.stringify(updated))
    set({ notifications: updated })
    // 같은 reminderId를 공유하는 미등록 알림이 남아있으면 예약 유지
    if (target && !updated.some(n => n.reminderId === target.reminderId)) {
      cancelPendingReminder(target.reminderId)
    }
  },
}))

/** 저장 후 id를 반환 — 호출부에서 즉시 알림 표시에 사용 */
export function saveDetectedNotification(notification: Record<string, unknown>, reminderId: string): string {
  // icon/iconLarge/image 는 base64 이진 데이터 — raw 가독성을 위해 제외
  const displayObj: Record<string, unknown> = { ...notification }
  delete displayObj.icon
  delete displayObj.iconLarge
  delete displayObj.image

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const item: DetectedNotification = {
    id,
    reminderId,
    app:   String(notification.app   ?? ''),
    title: String(notification.title ?? ''),
    text:  String(notification.text  ?? ''),
    time:  String(notification.time  ?? Date.now()),
    raw:   JSON.stringify(displayObj, null, 2),
  }
  const existing = storage.getString(StorageKeys.DETECTED_NOTIFICATIONS)
  const list: DetectedNotification[] = existing ? JSON.parse(existing) : []
  list.unshift(item)
  storage.set(StorageKeys.DETECTED_NOTIFICATIONS, JSON.stringify(list))
  return id
}

