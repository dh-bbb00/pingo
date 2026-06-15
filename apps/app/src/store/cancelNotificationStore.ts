import { create } from 'zustand'
import { storage, StorageKeys } from '@/utils/storage'

export interface CancelledNotification {
  id:    string
  title: string
  text:  string
  time:  string  // 감지 시각 (ms 문자열)
}

const EXPIRY_MS = 24 * 60 * 60 * 1000  // 24시간

interface CancelNotificationStore {
  notifications: CancelledNotification[]
  load:          () => void
  remove:        (id: string) => void
}

function filterExpired(list: CancelledNotification[]): CancelledNotification[] {
  const now = Date.now()
  return list.filter(item => {
    const t = parseInt(item.time, 10)
    return isNaN(t) || now - t < EXPIRY_MS
  })
}

export const useCancelNotificationStore = create<CancelNotificationStore>((set, get) => ({
  notifications: [],

  load: () => {
    const raw = storage.getString(StorageKeys.CANCEL_NOTIFICATIONS)
    const list: CancelledNotification[] = raw ? JSON.parse(raw) : []
    const valid = filterExpired(list)
    if (valid.length !== list.length) {
      storage.set(StorageKeys.CANCEL_NOTIFICATIONS, JSON.stringify(valid))
    }
    set({ notifications: valid })
  },

  remove: (id: string) => {
    const updated = get().notifications.filter(n => n.id !== id)
    storage.set(StorageKeys.CANCEL_NOTIFICATIONS, JSON.stringify(updated))
    set({ notifications: updated })
  },
}))

/** 저장 후 id를 반환 — 호출부에서 딥링크 알림 등록에 사용 */
export function saveCancelNotification(notification: Record<string, unknown>): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const item: CancelledNotification = {
    id,
    title: String(notification.title ?? ''),
    text:  String(notification.text  ?? ''),
    time:  String(notification.time  ?? Date.now()),
  }
  const existing = storage.getString(StorageKeys.CANCEL_NOTIFICATIONS)
  const list: CancelledNotification[] = existing ? JSON.parse(existing) : []
  list.unshift(item)
  storage.set(StorageKeys.CANCEL_NOTIFICATIONS, JSON.stringify(list.slice(0, 50)))
  return id
}
