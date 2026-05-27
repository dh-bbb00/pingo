import React, { useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import { usePasswordChangeForm } from './hooks/usePasswordChangeForm'
import { strings } from '@/constants/strings'
import { makeStyles } from './PasswordChangeScreen.styles'

const s = strings.passwordChange

export default function PasswordChangeScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { form, setField, isValid } = usePasswordChangeForm()

  async function handleChange() {
    if (!isValid()) return
    // TODO: 비밀번호 변경 API 연동
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      <TextInput
        style={styles.input}
        placeholder={s.currentPassword}
        value={form.current}
        onChangeText={(v) => setField('current', v)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={s.newPassword}
        value={form.next}
        onChangeText={(v) => setField('next', v)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={s.confirmPassword}
        value={form.confirm}
        onChangeText={(v) => setField('confirm', v)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleChange}>
        <Text style={styles.buttonText}>{s.submit}</Text>
      </TouchableOpacity>
    </View>
  )
}
