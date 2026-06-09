import React, { useEffect } from 'react'
import { AppState } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import BootSplash from 'react-native-bootsplash'
import notifee, { EventType } from '@notifee/react-native'
import { RootNavigator } from './src/navigation/RootNavigator'
import { navigationRef } from './src/navigation/navigationRef'
import { AppProviders } from './src/providers'
import { Screens } from './src/constants/screens'
import { setupNotificationChannel } from './src/utils/notification'
import {
  checkAndRequestNotificationListenerPermission,
  checkAndRequestBatteryOptimizationIfAuthorized,
} from './src/utils/notificationPermission'
import { useAuthStore } from './src/store/authStore'
import { storage, StorageKeys } from './src/utils/storage'

// 포그라운드 전용 — 앱이 열린 상태에서 알림 탭 시 호출
function navigateToNotificationLog() {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) return
  navigationRef.navigate(Screens.Root.UserTabs, {
    screen: Screens.UserTab.More,
    params: { screen: Screens.More.NotificationLog },
  } as any)
}

export default function App() {
  useEffect(() => {
    BootSplash.hide({ fade: true })
    setupNotificationChannel()

    const initAsync = async () => {
      // POST_NOTIFICATIONS 런타임 권한 요청 (Android 13+, Pingo 알림 표시용)
      await notifee.requestPermission()

      // 알림 접근 권한 확인 → 미허용 시 설정 이동 안내
      await checkAndRequestNotificationListenerPermission()

      // 앱이 알림 탭으로 실행된 경우 (killed 상태) — 인증 흐름 완료 후 처리하도록 pending 저장
      const initial = await notifee.getInitialNotification()
      if (initial?.pressAction?.id === 'notification-log') {
        storage.set(StorageKeys.PENDING_DEEPLINK, 'NotificationLog')
      }
    }
    initAsync()

    // 설정 갔다 돌아올 때 권한 재확인 → 새로 허용됐으면 배터리 최적화 안내
    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkAndRequestBatteryOptimizationIfAuthorized()
      }
    })

    // 포그라운드 notifee 이벤트 처리
    const unsub = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.pressAction?.id === 'notification-log') {
        navigateToNotificationLog()
      }
    })

    return () => {
      appStateSub.remove()
      unsub()
    }
  }, [])

  return (
    <AppProviders>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProviders>
  )
}
