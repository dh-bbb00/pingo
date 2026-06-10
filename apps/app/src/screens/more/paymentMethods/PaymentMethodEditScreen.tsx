import React, { useEffect, useMemo, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { showConfirm } from '@/store/confirmStore'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import {
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from './hooks/usePaymentMethodEdit'
import { makeStyles } from './PaymentMethodEditScreen.styles'

type Route = RouteProp<MoreStackParamList, 'PaymentMethodEdit'>

const s = strings.paymentMethods

export default function PaymentMethodEditScreen() {
  const { theme } = useTheme()
  const styles    = useMemo(() => makeStyles(theme), [theme])

  const { params } = useRoute<Route>()
  const isEdit              = !!params?.id
  const returnToTransaction = !!params?.returnToTransaction

  const { data: methods } = usePaymentMethods()
  const existing = methods?.find(m => m.id === params?.id)

  const [name,       setName]       = useState(() => existing?.name       ?? '')
  const [cardNumber, setCardNumber] = useState(() => existing?.cardNumber ?? '')
  const [isDefault,  setIsDefault]  = useState(() => existing?.isDefault  ?? false)
  const [submitted,  setSubmitted]  = useState(false)

  // 캐시가 늦게 도착하면 1회 세팅
  useEffect(() => {
    if (existing && name === '' && cardNumber === '') {
      setName(existing.name)
      setCardNumber(existing.cardNumber ?? '')
      setIsDefault(existing.isDefault)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  const { mutate: create, isPending: creating } = useCreatePaymentMethod(returnToTransaction)
  const { mutate: update, isPending: updating } = useUpdatePaymentMethod(params?.id ?? '')
  const { mutate: deletePM, isPending: deleting } = useDeletePaymentMethod(params?.id ?? '')

  const isPending  = creating || updating || deleting
  const nameError  = submitted && name.trim() === '' ? s.errNameEmpty : undefined

  function handleToggleDefault() {
    if (isDefault) {
      setIsDefault(false)
      return
    }
    const prevDefault = methods?.find(m => m.isDefault && m.id !== params?.id)
    if (prevDefault) {
      showConfirm(s.changeDefaultConfirmTitle, s.changeDefaultConfirmMsg(prevDefault.name), [
        { text: strings.common.cancel, style: 'cancel' },
        { text: strings.common.confirm, onPress: () => setIsDefault(true) },
      ])
    } else {
      setIsDefault(true)
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (name.trim() === '') return
    const payload = { name: name.trim(), cardNumber: cardNumber.trim() || undefined, isDefault }
    if (isEdit) update(payload)
    else        create(payload)
  }

  const handleDelete = () => {
    showConfirm(s.deleteConfirmTitle, s.deleteConfirmMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: s.deleteBtn, style: 'destructive', onPress: () => deletePM() },
    ])
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        <Text style={styles.title}>{isEdit ? s.headerEdit : s.headerCreate}</Text>

        <Text style={[styles.label, { marginBottom: 8 }]}>{s.nameLabel}</Text>
        <TextInput
          style={[styles.input, nameError && styles.inputError]}
          placeholder={s.namePlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          maxLength={20}
        />
        {nameError && <Text style={styles.errorText}>{nameError}</Text>}

        <View style={styles.gap} />

        <View style={styles.labelRow}>
          <Text style={styles.label}>{s.cardNumberLabel}</Text>
          <Text style={styles.labelSuffix}>{s.cardNumberSuffix}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={s.cardNumberPlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={cardNumber}
          onChangeText={setCardNumber}
          returnKeyType="done"
          keyboardType="number-pad"
          maxLength={4}
        />

        <View style={styles.gap} />

        <TouchableOpacity style={styles.toggleRow} onPress={handleToggleDefault} activeOpacity={0.7}>
          <Text style={styles.toggleLabel}>{s.isDefaultLabel}</Text>
          <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
            {isDefault && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, isPending && styles.btnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isPending}
        >
          <Text style={styles.submitBtnText}>{isEdit ? s.update : s.submit}</Text>
        </TouchableOpacity>

        {isEdit && (
          <TouchableOpacity
            style={[styles.deleteBtn, isPending && styles.btnDisabled]}
            onPress={handleDelete}
            activeOpacity={0.8}
            disabled={isPending}
          >
            <Text style={styles.deleteBtnText}>{s.deleteBtn}</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  )
}
