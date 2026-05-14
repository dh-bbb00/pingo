import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/endpoints/auth.api'
import type { AuthStackParamList } from '@/types/navigation'
import { useLoginForm } from './hooks/useLoginForm'
import { styles } from './LoginScreen.styles'

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>

export default function LoginScreen() {
  const navigation = useNavigation<Nav>()
  const { setTokens, setUserInfo } = useAuthStore()
  const { form, setField, persistPreferences } = useLoginForm()

  async function handleLogin() {
    try {
      persistPreferences()
      // TODO: authApi.login 연동 후 setTokens, setUserInfo 호출
    } catch {
      // TODO: 에러 처리
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={form.email}
        onChangeText={(v) => setField('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={form.password}
        onChangeText={(v) => setField('password', v)}
        secureTextEntry
      />

      <View style={styles.options}>
        <View style={styles.row}>
          <Text>이메일 저장</Text>
          <Switch value={form.saveEmail} onValueChange={(v) => setField('saveEmail', v)} />
        </View>
        <View style={styles.row}>
          <Text>자동 로그인</Text>
          <Switch value={form.autoLogin} onValueChange={(v) => setField('autoLogin', v)} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ApprovalRequest')}>
        <Text style={styles.link}>계정이 없으신가요? 승인 요청</Text>
      </TouchableOpacity>
    </View>
  )
}
