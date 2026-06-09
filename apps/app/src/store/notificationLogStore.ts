import { create } from 'zustand'
import { storage, StorageKeys } from '@/utils/storage'

export interface DetectedNotification {
  id:    string
  app:   string
  title: string
  text:  string
  time:  string
  raw:   string  // JSON.stringify된 원본 데이터
}

interface NotificationLogStore {
  notifications: DetectedNotification[]
  load:          () => void
  clear:         () => void
}

export const useNotificationLogStore = create<NotificationLogStore>((set) => ({
  notifications: [],

  load: () => {
    const raw = storage.getString(StorageKeys.DETECTED_NOTIFICATIONS)
    const list: DetectedNotification[] = raw ? JSON.parse(raw) : []
    set({ notifications: list })
  },

  clear: () => {
    storage.remove(StorageKeys.DETECTED_NOTIFICATIONS)
    set({ notifications: [] })
  },
}))

export function saveDetectedNotification(notification: Record<string, unknown>) {
  // icon/iconLarge/image 는 base64 이진 데이터 — raw 가독성을 위해 제외
  const displayObj: Record<string, unknown> = { ...notification }
  delete displayObj.icon
  delete displayObj.iconLarge
  delete displayObj.image

  const item: DetectedNotification = {
    id:    Date.now().toString(),
    app:   String(notification.app   ?? ''),
    title: String(notification.title ?? ''),
    text:  String(notification.text  ?? ''),
    time:  String(notification.time  ?? Date.now()),
    raw:   JSON.stringify(displayObj, null, 2),
  }
  const existing = storage.getString(StorageKeys.DETECTED_NOTIFICATIONS)
  const list: DetectedNotification[] = existing ? JSON.parse(existing) : []
  list.unshift(item)
  storage.set(StorageKeys.DETECTED_NOTIFICATIONS, JSON.stringify(list.slice(0, 100)))
}
