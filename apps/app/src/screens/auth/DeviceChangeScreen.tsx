import React, { useMemo } from 'react'
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import FullScreenContainer from '@/components/containers/FullScreenContainer'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useDeviceApprovalRequest } from './hooks/useDeviceApprovalRequest'
import { makeStyles } from './DeviceChangeScreen.styles'

const s = strings.deviceChange

export default function DeviceChangeScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { mutate: requestApproval, isPending } = useDeviceApprovalRequest()

  return (
    <FullScreenContainer style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>{s.title}</Text>
      <Text style={styles.desc}>{s.desc}</Text>

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={() => requestApproval()}
        disabled={isPending}
      >
        {isPending
          ? <ActivityIndicator color={theme.colors.text.inverse} />
          : <Text style={styles.buttonText}>{s.submit}</Text>
        }
      </TouchableOpacity>
    </FullScreenContainer>
  )
}
