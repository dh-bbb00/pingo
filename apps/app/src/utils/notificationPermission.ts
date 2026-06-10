import { Linking } from 'react-native'
import { showConfirm } from '@/store/confirmStore'
import RNAndroidNotificationListener from 'react-native-android-notification-listener'
import { storage, StorageKeys } from './storage'
import { strings } from '@/constants/strings'

const s = strings.permission

export async function checkAndRequestNotificationListenerPermission(): Promise<boolean> {
  const status = await RNAndroidNotificationListener.getPermissionStatus()
  if (status === 'authorized') return true

  showConfirm(
    s.notificationListenerTitle,
    s.notificationListenerMsg,
    [
      { text: s.later, style: 'cancel' },
      {
        text: s.goToSettings,
        onPress: () => RNAndroidNotificationListener.requestPermission(),
      },
    ],
  )
  return false
}

/** 설정에서 돌아올 때 호출 — 권한이 새로 허용된 경우에만 배터리 최적화 안내 */
export async function checkAndRequestBatteryOptimizationIfAuthorized() {
  const status = await RNAndroidNotificationListener.getPermissionStatus()
  if (status === 'authorized') checkAndRequestBatteryOptimization()
}

export function checkAndRequestBatteryOptimization() {
  // 최초 1회만 안내 — 앱 종료 상태에서도 알림 감지를 위해 배터리 최적화 제외 필요
  if (storage.getBoolean(StorageKeys.BATTERY_OPT_PROMPTED)) return
  storage.set(StorageKeys.BATTERY_OPT_PROMPTED, true)

  showConfirm(
    s.batteryOptTitle,
    s.batteryOptMsg,
    [
      { text: s.later, style: 'cancel' },
      {
        text: s.goToSettings,
        onPress: () => Linking.openSettings(),
      },
    ],
  )
}
