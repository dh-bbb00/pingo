import React, { useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useTheme } from '@/theme'
import { usePasswordChangeForm } from './hooks/usePasswordChangeForm'
import { useChangePassword } from './hooks/useChangePassword'
import { strings } from '@/constants/strings'
import { makeStyles } from './PasswordChangeScreen.styles'

const s = strings.passwordChange

export default function PasswordChangeScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { form, setField, markTouched, setServerError, getVisibleErrors, trySubmit } = usePasswordChangeForm()
  const { mutate: changePassword, isPending } = useChangePassword(
    (message) => setServerError('current', message),
  )

  const errors = getVisibleErrors()

  function handleChange() {
    trySubmit(() => changePassword({ currentPassword: form.current, newPassword: form.next }))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      <TextInput
        style={[styles.input, errors.current ? styles.inputError : styles.inputNormal]}
        placeholder={s.currentPassword}
        placeholderTextColor={theme.colors.text.disabled}
        value={form.current}
        onChangeText={(v) => setField('current', v)}
        onBlur={() => markTouched('current')}
        secureTextEntry
      />
      {errors.current && <Text style={styles.errorText}>{errors.current}</Text>}

      <TextInput
        style={[styles.input, errors.next ? styles.inputError : styles.inputNormal]}
        placeholder={s.newPassword}
        placeholderTextColor={theme.colors.text.disabled}
        value={form.next}
        onChangeText={(v) => setField('next', v)}
        onBlur={() => markTouched('next')}
        secureTextEntry
      />
      {errors.next && <Text style={styles.errorText}>{errors.next}</Text>}

      <TextInput
        style={[styles.input, errors.confirm ? styles.inputError : styles.inputNormal]}
        placeholder={s.confirmPassword}
        placeholderTextColor={theme.colors.text.disabled}
        value={form.confirm}
        onChangeText={(v) => setField('confirm', v)}
        onBlur={() => markTouched('confirm')}
        secureTextEntry
      />
      {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleChange} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color={theme.colors.text.inverse} />
          : <Text style={styles.buttonText}>{s.submit}</Text>
        }
      </TouchableOpacity>
    </View>
  )
}
