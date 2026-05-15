import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/endpoints/auth.api'
import { handleApiError } from '@/api/errorHandler'
import { getDeviceId } from '@/utils/device'
import { strings } from '@/constants/strings'
import type { RootStackParamList, AuthStackParamList } from '@/types/navigation'
import { useLoginForm } from './hooks/useLoginForm'
import { styles } from './LoginScreen.styles'

const s = strings.login

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>()
  const { setTokens, setUserInfo } = useAuthStore()
  const { form, setField, persistPreferences } = useLoginForm()

  async function handleLogin() {
    try {
      persistPreferences()
      const deviceUid = await getDeviceId()
      const { data: resp } = await authApi.login({
        email: form.email,
        password: form.password,
        deviceUid,
      })
      const { accessToken, refreshToken, role, approvalStatus } = resp.data
      setTokens(accessToken, refreshToken)
      setUserInfo(role, approvalStatus)

      const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()
      if (role === 'ADMIN') {
        rootNav?.replace('AdminTabs', { screen: 'UserManagement' })
      } else {
        rootNav?.replace('UserTabs', { screen: 'Home' })
      }
    } catch (error: unknown) {
      handleApiError(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{s.title}</Text>

      <TextInput
        style={styles.input}
        placeholder={s.email}
        value={form.email}
        onChangeText={(v) => setField('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={s.password}
        value={form.password}
        onChangeText={(v) => setField('password', v)}
        secureTextEntry
      />

      <View style={styles.options}>
        <View style={styles.row}>
          <Text>{s.saveEmail}</Text>
          <Switch value={form.saveEmail} onValueChange={(v) => setField('saveEmail', v)} />
        </View>
        <View style={styles.row}>
          <Text>{s.autoLogin}</Text>
          <Switch value={form.autoLogin} onValueChange={(v) => setField('autoLogin', v)} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{s.submit}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ApprovalRequest')}>
        <Text style={styles.link}>{s.noAccount}</Text>
      </TouchableOpacity>
    </View>
  )
}
