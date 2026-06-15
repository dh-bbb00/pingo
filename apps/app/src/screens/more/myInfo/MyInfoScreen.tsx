import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Switch } from 'react-native'
import SkeletonBox from '@/components/containers/SkeletonBox'
import { showConfirm } from '@/store/confirmStore'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '@/store/authStore'
import type { MoreStackParamList } from '@/types/navigation'
import type { MyDevice } from '@/api/endpoints/users.api'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { useMyInfo } from './hooks/useMyInfo'
import { useMyDevices } from './hooks/useMyDevices'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { useDeleteDevice } from './hooks/useDeleteDevice'
import { makeStyles } from './MyInfoScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'MyInfo'>

const s = strings.myInfo

export default function MyInfoScreen() {
  const { theme, mode, toggleTheme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { logout } = useAuthStore()
  const { data: myInfo,  isLoading: infoLoading,    refetch: refetchMyInfo  } = useMyInfo()
  const { data: devices, isLoading: devicesLoading, refetch: refetchDevices } = useMyDevices()
  const { refreshing, onRefresh } = usePullToRefresh(() => Promise.all([refetchMyInfo(), refetchDevices()]))
  const { mutate: deleteDevice } = useDeleteDevice()

  function handleLogout() {
    showConfirm(s.logout, strings.common.logoutConfirmMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, style: 'destructive', onPress: logout },
    ])
  }

  function handleDeleteDevice(device: MyDevice) {
    const title = device.isCurrent ? s.confirmDeleteCurrentTitle : s.confirmDeleteOtherTitle
    const msg   = device.isCurrent ? s.confirmDeleteCurrentMsg   : s.confirmDeleteOtherMsg
    showConfirm(title, msg, [
      { text: strings.common.cancel, style: 'cancel' },
      {
        text: strings.common.confirm,
        style: 'destructive',
        onPress: () => deleteDevice({ deviceId: device.id, isCurrent: device.isCurrent }),
      },
    ])
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
    >
      <Text style={styles.header}>{s.header}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{s.emailLabel}</Text>
        {infoLoading
          ? <SkeletonBox width="55%" height={14} radius={4} />
          : <Text style={styles.value}>{myInfo?.email ?? '-'}</Text>
        }
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate(Screens.More.PasswordChange)}
      >
        <Text style={styles.menuLabel}>{s.changePassword}</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.switchRow}>
        <Text style={styles.menuLabel}>{s.darkMode}</Text>
        <Switch
          value={mode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.colors.divider, true: theme.colors.primaryLight }}
          thumbColor={mode === 'dark' ? theme.colors.primary : theme.colors.text.disabled}
        />
      </View>

      {devicesLoading ? (
        <>
          <SkeletonBox width={80} height={10} radius={4} style={styles.devicesHeaderSkeleton} />
          {[0, 1].map(i => (
            <View key={i} style={styles.deviceItem}>
              <View style={styles.deviceInfo}>
                <SkeletonBox width="45%" height={13} radius={4} style={{ marginBottom: 6 }} />
                <SkeletonBox width="30%" height={10} radius={4} />
              </View>
              <SkeletonBox width={44} height={26} radius={6} />
            </View>
          ))}
        </>
      ) : devices && devices.length > 0 && (
        <>
          <Text style={styles.devicesHeader}>{s.devicesHeader}</Text>
          {devices.map((device) => (
            <View key={device.id} style={device.isCurrent ? styles.deviceItemCurrent : styles.deviceItem}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.deviceName}</Text>
                <Text style={styles.deviceModel}>{device.phoneModel}</Text>
                {device.isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>{s.currentDeviceBadge}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteDevice(device)}>
                <Text style={styles.deleteBtnText}>{s.deleteDevice}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{s.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
