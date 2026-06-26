import React, { useEffect, useMemo } from 'react'
import { View, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { apiClient } from '@/api/client'
import { endpoints } from '@/constants/endpoints'
import { useAuthStore } from '@/store/authStore'
import { storage, StorageKeys } from '@/utils/storage'
import { getDeviceId } from '@/utils/device'
import { fixedExpensesApi } from '@/api/endpoints/fixedExpenses.api'
import { syncFixedExpenseReminders } from '@/utils/notification'
import { usersApi } from '@/api/endpoints/users.api'
import messaging from '@react-native-firebase/messaging'
import notifee from '@notifee/react-native'
import { resetToTransactionEdit, resetToCancelSearch } from '@/navigation/navigationRef'
import type { RootStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { makeStyles } from './SplashScreen.styles'

const s = strings.splash

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>

export default function SplashScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { setTokens, setUserInfo } = useAuthStore()

  useEffect(() => {
    // 앱 재시작 시 자동 로그인 진입점.
    // refresh token이 있고 autoLogin=true인 경우 /auth/refresh를 호출해 토큰을 재발급받는다.
    // 재발급이 성공하면 만료가 다시 30일 연장된다 (rolling).
    // 30일 동안 앱을 켜지 않으면 refresh token이 만료되어 로그인 화면으로 이동한다.
    const minDelay = new Promise<void>(resolve => setTimeout(resolve, 1000))

    async function bootstrap() {
      // killed 상태에서 알림 탭으로 앱이 실행된 경우 — 어떤 분기로 이동하든 딥링크 유지되도록 먼저 처리
      const initial = await notifee.getInitialNotification()
      if (initial?.pressAction?.id === 'pending-notifications') {
        const notificationId = initial.notification?.data?.notificationId as string | undefined
        if (notificationId) storage.set(StorageKeys.PENDING_DEEPLINK, notificationId)
      }
      if (initial?.pressAction?.id === 'cancel-notification') {
        const cancelNotificationId = initial.notification?.data?.cancelNotificationId as string | undefined
        if (cancelNotificationId) storage.set(StorageKeys.PENDING_CANCEL_DEEPLINK, cancelNotificationId)
      }

      const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN)
      const autoLogin    = storage.getBoolean(StorageKeys.AUTO_LOGIN)

      // 둘 중 하나라도 없으면 자동 로그인 시도 없이 바로 로그인 화면으로
      if (!refreshToken || !autoLogin) {
        navigation.replace(Screens.Root.Auth, { screen: Screens.Auth.Login })
        return
      }

      try {
        const { data: resp } = await apiClient.post<{
          success: boolean
          data: {
            accessToken:    string
            refreshToken:   string
            role:           'USER' | 'ADMIN'
            approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
            deviceUid:      string
          }
        }>(endpoints.auth.refresh, { refreshToken })

        const { accessToken, refreshToken: newRefreshToken, role, approvalStatus, deviceUid: storedDeviceUid } = resp.data

        setTokens(accessToken, newRefreshToken)
        setUserInfo(role, approvalStatus)

        // FCM 토큰 발급 후 서버에 저장 — 실패 시 무시
        messaging().getToken()
          .then(fcmToken => usersApi.saveFcmToken(fcmToken))
          .catch(() => {})

        const currentDeviceUid = await getDeviceId()
        if (storedDeviceUid && storedDeviceUid !== currentDeviceUid) {
          // 기기 불일치 — access token은 이미 저장됐으므로 DeviceChange에서 그대로 사용
          navigation.replace(Screens.Root.Auth, { screen: Screens.Auth.DeviceChange })
          return
        }

        if (approvalStatus === 'PENDING') {
          navigation.replace(Screens.Root.Auth, { screen: Screens.Auth.ApprovalPending })
          return
        }

        if (role === 'ADMIN') {
          navigation.replace(Screens.Root.AdminTabs, { screen: Screens.AdminTab.UserManagement })
        } else {
          // 고정 지출 납부일 알림 동기화 — TimestampTrigger는 1회성이므로 매 앱 시작마다 재예약
          fixedExpensesApi.getList()
            .then(r => syncFixedExpenseReminders(r.data.data))
            .catch(() => {})

          const pendingCancelId = storage.getString(StorageKeys.PENDING_CANCEL_DEEPLINK)
          if (pendingCancelId) {
            storage.remove(StorageKeys.PENDING_CANCEL_DEEPLINK)
            navigation.replace(Screens.Root.UserTabs, { screen: Screens.UserTab.Home })
            resetToCancelSearch(pendingCancelId)
            return
          }

          const pendingNotificationId = storage.getString(StorageKeys.PENDING_DEEPLINK)
          if (pendingNotificationId) {
            storage.remove(StorageKeys.PENDING_DEEPLINK)
            navigation.replace(Screens.Root.UserTabs, { screen: Screens.UserTab.Home })
            resetToTransactionEdit(pendingNotificationId)
          } else {
            navigation.replace(Screens.Root.UserTabs, { screen: Screens.UserTab.Home })
          }
        }
      } catch {
        navigation.replace(Screens.Root.Auth, { screen: Screens.Auth.Login })
      }
    }

    Promise.all([bootstrap(), minDelay])
  }, [navigation, setTokens, setUserInfo])

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/pingo_logo_icon.png')} style={styles.logo} />
      <Text style={styles.title}>{s.title}</Text>
    </View>
  )
}
