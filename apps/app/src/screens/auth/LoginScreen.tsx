import React, { useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useLogin } from './hooks/useLogin'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import type { AuthStackParamList } from '@/types/navigation'
import { useLoginForm } from './hooks/useLoginForm'
import { makeStyles } from './LoginScreen.styles'

const s = strings.login

export default function LoginScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

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
        placeholderTextColor={theme.colors.text.disabled}
        value={form.email}
        onChangeText={(v) => setField('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={s.password}
        placeholderTextColor={theme.colors.text.disabled}
        value={form.password}
        onChangeText={(v) => setField('password', v)}
        secureTextEntry
      />

      <View style={styles.options}>
        <View style={styles.row}>
          <Text style={styles.optionLabel}>{s.saveEmail}</Text>
          <Switch
            value={form.saveEmail}
            onValueChange={(v) => setField('saveEmail', v)}
            trackColor={{ false: theme.colors.divider, true: theme.colors.primaryLight }}
            thumbColor={form.saveEmail ? theme.colors.primary : theme.colors.text.disabled}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.optionLabel}>{s.autoLogin}</Text>
          <Switch
            value={form.autoLogin}
            onValueChange={(v) => setField('autoLogin', v)}
            trackColor={{ false: theme.colors.divider, true: theme.colors.primaryLight }}
            thumbColor={form.autoLogin ? theme.colors.primary : theme.colors.text.disabled}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color={theme.colors.text.inverse} />
          : <Text style={styles.buttonText}>{s.submit}</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate(Screens.Auth.ApprovalRequest)}>
        <Text style={styles.link}>{s.noAccount}</Text>
      </TouchableOpacity>
    </View>
  )
}
