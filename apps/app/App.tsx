import React, { useEffect } from 'react'
import { AppState } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import BootSplash from 'react-native-bootsplash'
import notifee, { EventType } from '@notifee/react-native'
import { RootNavigator } from './src/navigation/RootNavigator'
import { navigationRef, resetToTransactionEdit, resetToCancelSearch } from './src/navigation/navigationRef'
import { AppProviders } from './src/providers'
import { setupNotificationChannel } from './src/utils/notification'
import {
  checkAndRequestNotificationListenerPermission,
  checkAndRequestBatteryOptimizationIfAuthorized,
} from './src/utils/notificationPermission'
import { useAuthStore } from './src/store/authStore'
import { storage, StorageKeys } from './src/utils/storage'
import { View } from 'react-native'
import { useTheme } from './src/theme'

// NavigationContainer에 테마 배경을 주입 — 슬라이드 애니메이션 중 흰 플래시 방지
function ThemedNavigationContainer({ children }: { children: React.ReactNode }) {
  const { theme, mode } = useTheme()
  const navTheme = {
    ...DefaultTheme,
    dark: mode === 'dark',
    colors: {
      ...DefaultTheme.colors,
      primary:      theme.colors.primary,
      background:   theme.colors.background,
      card:         theme.colors.background,
      text:         theme.colors.text.primary,
      border:       theme.colors.border,
      notification: theme.colors.primary,
    },
  }
  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      {children}
    </NavigationContainer>
  )
}

// 포그라운드/백그라운드 전용 — 로그인 상태에서 알림 탭 시 호출
function navigateToTransactionEdit(notificationId: string) {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) return
  resetToTransactionEdit(notificationId)
}

function navigateToCancelSearch(cancelNotificationId: string) {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) return
  resetToCancelSearch(cancelNotificationId)
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

      // killed 상태 알림 탭 딥링크는 SplashScreen.bootstrap() 에서 처리
    }
    initAsync()

    // 설정 갔다 돌아올 때 권한 재확인 + 백그라운드 알림 탭 딥링크 처리
    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkAndRequestBatteryOptimizationIfAuthorized()

        // 백그라운드 상태에서 알림 탭 → onBackgroundEvent가 storage에 저장 → 여기서 네비게이트
        // accessToken이 있을 때(로그인 상태)만 처리 — 미로그인 상태에서 권한 다이얼로그 등으로
        // AppState가 active로 전환되면 PENDING_DEEPLINK가 소비되는 문제 방지
        const { accessToken } = useAuthStore.getState()
        if (accessToken) {
          const pendingId = storage.getString(StorageKeys.PENDING_DEEPLINK)
          if (pendingId) {
            storage.remove(StorageKeys.PENDING_DEEPLINK)
            navigateToTransactionEdit(pendingId)
          }
          const pendingCancelId = storage.getString(StorageKeys.PENDING_CANCEL_DEEPLINK)
          if (pendingCancelId) {
            storage.remove(StorageKeys.PENDING_CANCEL_DEEPLINK)
            navigateToCancelSearch(pendingCancelId)
          }
        }
      }
    })

    // 포그라운드 notifee 이벤트 처리
    const unsub = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.pressAction?.id === 'pending-notifications') {
        const notificationId = detail.notification?.data?.notificationId as string | undefined
        if (notificationId) navigateToTransactionEdit(notificationId)
      }
      if (type === EventType.PRESS && detail.pressAction?.id === 'cancel-notification') {
        const cancelNotificationId = detail.notification?.data?.cancelNotificationId as string | undefined
        if (cancelNotificationId) navigateToCancelSearch(cancelNotificationId)
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
        <View style={{ flex: 1 }}>
          <ThemedNavigationContainer>
            <RootNavigator />
          </ThemedNavigationContainer>
        </View>
      </SafeAreaProvider>
    </AppProviders>
  )
}
