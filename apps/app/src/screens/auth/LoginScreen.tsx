import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useLogin } from '@/hooks/queries/useLogin'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import type { AuthStackParamList } from '@/types/navigation'
import { useLoginForm } from './hooks/useLoginForm'
import { styles } from './LoginScreen.styles'

const s = strings.login

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>()
  const { form, setField, persistPreferences } = useLoginForm()
  const { mutate: login, isPending } = useLogin()

  function handleLogin() {
    persistPreferences()
    login({ email: form.email, password: form.password })
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

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color="#FFFFFF" />
          : <Text style={styles.buttonText}>{s.submit}</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate(Screens.Auth.ApprovalRequest)}>
        <Text style={styles.link}>{s.noAccount}</Text>
      </TouchableOpacity>
    </View>
  )
}
