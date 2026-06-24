import React, { useEffect } from 'react'
import { AppState } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
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
import { View } from 'react-native'
import { useTheme } from './src/theme'
import PendingNotificationsBanner from './src/components/banner/PendingNotificationsBanner'

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

// 포그라운드 전용 — 앱이 열린 상태에서 감지 알림 탭 시 직접 등록 화면으로 이동
function navigateToTransactionEdit(notificationId: string) {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) return
  navigationRef.navigate(Screens.Root.UserTabs, {
    screen: Screens.UserTab.History,
    params: {
      screen: Screens.History.TransactionEdit,
      params: { notificationId },
    },
  } as any)
}

// 포그라운드 전용 — 취소 알림 탭 시 원 거래 내역 찾기 화면으로 이동
function navigateToCancelSearch(cancelNotificationId: string) {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) return
  navigationRef.navigate(Screens.Root.UserTabs, {
    screen: Screens.UserTab.History,
    params: {
      screen: Screens.History.CancelledTransactionSearch,
      params: { cancelNotificationId },
    },
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

      // 앱이 알림 탭으로 실행된 경우 (killed 상태) — 인증 흐름 완료 후 처리하도록 id 저장
      const initial = await notifee.getInitialNotification()
      if (initial?.pressAction?.id === 'pending-notifications') {
        const notificationId = initial.notification?.data?.notificationId as string | undefined
        storage.set(StorageKeys.PENDING_DEEPLINK, notificationId ?? '')
      }
      if (initial?.pressAction?.id === 'cancel-notification') {
        const cancelNotificationId = initial.notification?.data?.cancelNotificationId as string | undefined
        storage.set(StorageKeys.PENDING_CANCEL_DEEPLINK, cancelNotificationId ?? '')
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
          <PendingNotificationsBanner />
          <ThemedNavigationContainer>
            <RootNavigator />
          </ThemedNavigationContainer>
        </View>
      </SafeAreaProvider>
    </AppProviders>
  )
}
