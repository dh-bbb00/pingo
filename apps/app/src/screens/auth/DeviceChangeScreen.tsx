import React, { useMemo } from 'react'
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import FullScreenContainer from '@/components/containers/FullScreenContainer'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { AuthStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useApprovalRequest } from './hooks/useApprovalRequest'
import { makeStyles } from './DeviceChangeScreen.styles'

type Route = RouteProp<AuthStackParamList, 'DeviceChange'>

const s = strings.deviceChange

export default function DeviceChangeScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { params } = useRoute<Route>()
  const { mutate: requestApproval, isPending } = useApprovalRequest()

  return (
    <FullScreenContainer style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>{s.title}</Text>
      <Text style={styles.desc}>{s.desc}</Text>

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={() => requestApproval({ email: params.email, password: params.password })}
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
