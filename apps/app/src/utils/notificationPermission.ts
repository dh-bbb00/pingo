import { Linking } from 'react-native'
import { showConfirm } from '@/store/confirmStore'
import RNAndroidNotificationListener from 'react-native-android-notification-listener'
import { storage, StorageKeys } from './storage'

export async function checkAndRequestNotificationListenerPermission(): Promise<boolean> {
  const status = await RNAndroidNotificationListener.getPermissionStatus()
  if (status === 'authorized') return true

  showConfirm(
    '알림 접근 권한 필요',
    'Pingo가 카드 결제 알림을 감지하려면 알림 접근 권한이 필요합니다.\n\n설정 화면에서 Pingo를 허용해주세요.',
    [
      { text: '나중에', style: 'cancel' },
      {
        text: '설정으로 이동',
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
    '배터리 최적화 설정',
    '앱이 완전히 종료된 상태에서도 알림을 감지하려면 배터리 최적화를 꺼야 합니다.\n\n설정 > 배터리 > 앱별 최적화에서 Pingo를 "최적화 안 함"으로 설정해주세요.',
    [
      { text: '나중에', style: 'cancel' },
      {
        text: '설정으로 이동',
        onPress: () => Linking.openSettings(),
      },
    ],
  )
}
