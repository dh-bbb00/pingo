import React, { useMemo } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuthStore } from '@/store/authStore'
import { useNotificationLogStore } from '@/store/notificationLogStore'
import { resetToPendingNotifications } from '@/navigation/navigationRef'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles } from './PendingNotificationsBanner.styles'

export default function PendingNotificationsBanner() {
  const { theme } = useTheme()
  const insets    = useSafeAreaInsets()

  const { role, approvalStatus, accessToken } = useAuthStore()
  const notifications = useNotificationLogStore(s => s.notifications)

  const count  = notifications.length
  const styles = useMemo(() => makeStyles(theme, insets.top), [theme, insets.top])

  if (!accessToken || role !== 'USER' || approvalStatus !== 'APPROVED' || count === 0) return null

  const handlePress = () => resetToPendingNotifications()

  return (
    <TouchableOpacity style={styles.banner} onPress={handlePress} activeOpacity={0.85}>
      <Text style={styles.text}>{strings.pendingBanner.message(count)}</Text>
    </TouchableOpacity>
  )
}
