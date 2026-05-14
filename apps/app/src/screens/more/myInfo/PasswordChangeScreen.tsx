import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { usePasswordChangeForm } from './hooks/usePasswordChangeForm'
import { styles } from './PasswordChangeScreen.styles'

export default function PasswordChangeScreen() {
  const { form, setField, isValid } = usePasswordChangeForm()

  async function handleChange() {
    if (!isValid()) return
    // TODO: 비밀번호 변경 API 연동
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>비밀번호 변경</Text>

      <TextInput
        style={styles.input}
        placeholder="현재 비밀번호"
        value={form.current}
        onChangeText={(v) => setField('current', v)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        value={form.next}
        onChangeText={(v) => setField('next', v)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호 확인"
        value={form.confirm}
        onChangeText={(v) => setField('confirm', v)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleChange}>
        <Text style={styles.buttonText}>변경</Text>
      </TouchableOpacity>
    </View>
  )
}
