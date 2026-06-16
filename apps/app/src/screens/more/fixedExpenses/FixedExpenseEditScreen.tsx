import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Switch, Platform,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useFixedExpenseForm } from './hooks/useFixedExpenseForm'
import { makeStyles } from './FixedExpenseEditScreen.styles'
import { useFixedExpenses, useCreateFixedExpense, useUpdateFixedExpense, useDeleteFixedExpense } from '@/hooks/queries/useFixedExpenses'
import { fixedExpensesApi } from '@/api/endpoints/fixedExpenses.api'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import { useCategoryById } from '@/screens/category/hooks/useCategoryById'
import CategoryPickerModal from '@/screens/history/components/CategoryPickerModal'
import PaymentMethodPickerModal from '@/screens/history/components/PaymentMethodPickerModal'
import { handleApiError } from '@/api/errorHandler'
import { Screens } from '@/constants/screens'
import { navigationRef } from '@/navigation/navigationRef'
import Toast from 'react-native-toast-message'
import { showConfirm } from '@/store/confirmStore'

type Route = RouteProp<MoreStackParamList, 'FixedExpenseEdit'>
type Nav   = NativeStackNavigationProp<MoreStackParamList, 'FixedExpenseEdit'>

const s  = strings.fixedExpenseEdit

export default function FixedExpenseEditScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { params }  = useRoute<Route>()
  const navigation  = useNavigation<Nav>()
  const isEdit      = !!params?.id
  const title       = isEdit ? s.headerEdit : s.headerCreate

  const { data: items = [] } = useFixedExpenses()
  const { form, setField, setForm, isValid } = useFixedExpenseForm()
  const { mutate: create,  isPending: creating  } = useCreateFixedExpense()
  const { mutate: update,  isPending: updating  } = useUpdateFixedExpense()
  const { mutate: deleteFe, isPending: deleting } = useDeleteFixedExpense()

  const initialized = useRef(false)

  // edit 모드: 기존 데이터를 폼에 1회 세팅
  useEffect(() => {
    if (!isEdit || initialized.current) return
    const item = items.find(i => i.id === params?.id)
    if (!item) return
    initialized.current = true
    setForm({
      merchantName:    item.merchantName,
      amount:          item.amount.toString(),
      categoryId:      item.categoryId,
      paymentMethodId: item.paymentMethodId ?? '',
      memo:            item.memo            ?? '',
      dayOfMonth:      item.dayOfMonth.toString(),
      isActive:        item.isActive,
    })
  }, [items, isEdit, params?.id, setForm])

  const { data: selectedCategory } = useCategoryById(form.categoryId || undefined)
  const { data: paymentMethods }   = usePaymentMethods()
  const selectedPaymentMethod      = paymentMethods?.find(m => m.id === form.paymentMethodId)

  const [showCategoryPicker,      setShowCategoryPicker]      = useState(false)
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isPending = creating || updating || deleting

  const merchantError  = submitted && form.merchantName.trim() === ''
  const amountError    = submitted && form.amount === ''
  const dayError       = submitted && form.dayOfMonth === ''

  // 저장 후 자동등록 체크 및 컨펌 흐름
  const handlePostSave = async (fixedExpenseId: string, baseSuccessText: string) => {
    if (!form.isActive) {
      Toast.show({ type: 'success', text1: baseSuccessText })
      navigation.goBack()
      return
    }
    try {
      const { data: statusRes } = await fixedExpensesApi.getThisMonthStatus(fixedExpenseId)
      if (statusRes.data.registered) {
        Toast.show({ type: 'success', text1: baseSuccessText })
        navigation.goBack()
        return
      }
      showConfirm(
        s.registerThisMonthTitle,
        s.registerThisMonthMsg(form.merchantName.trim()),
        [
          {
            text: strings.common.cancel,
            style: 'cancel',
            onPress: () => {
              Toast.show({ type: 'success', text1: baseSuccessText })
              navigation.goBack()
            },
          },
          {
            text: s.registerThisMonthOk,
            onPress: async () => {
              try {
                await fixedExpensesApi.registerThisMonth(fixedExpenseId)
                Toast.show({
                  type: 'success',
                  text1: isEdit ? s.successUpdateAndRegister : s.successCreateAndRegister,
                })
              } catch {
                Toast.show({ type: 'success', text1: baseSuccessText })
              }
              navigation.goBack()
            },
          },
        ],
      )
    } catch {
      Toast.show({ type: 'success', text1: baseSuccessText })
      navigation.goBack()
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (!isValid()) return
    const payload = {
      merchantName:    form.merchantName.trim(),
      amount:          Number(form.amount),
      categoryId:      form.categoryId || undefined,
      paymentMethodId: form.paymentMethodId || undefined,
      memo:            form.memo.trim() || undefined,
      dayOfMonth:      Number(form.dayOfMonth),
      isActive:        form.isActive,
    }
    if (isEdit) {
      update(
        { id: params!.id!, payload },
        {
          onSuccess: () => handlePostSave(params!.id!, s.successUpdate),
          onError:   (e) => handleApiError(e),
        },
      )
    } else {
      create(payload, {
        onSuccess: (data) => handlePostSave(data.data.data.id, s.successCreate),
        onError:   (e) => handleApiError(e),
      })
    }
  }

  const handleDelete = () => {
    showConfirm(s.confirmDeleteTitle, s.confirmDeleteMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      {
        text: s.confirmDeleteOk,
        style: 'destructive',
        onPress: () => deleteFe(params!.id!, {
          onSuccess: () => navigation.goBack(),
          onError:   (e) => handleApiError(e),
        }),
      },
    ])
  }

  const handleToggleActive = (value: boolean) => {
    if (!value) {
      showConfirm(s.confirmDisableTitle, s.confirmDisableMsg, [
        { text: s.confirmDisableCancel, style: 'cancel' },
        { text: s.confirmDisableOk, style: 'destructive', onPress: () => setField('isActive', false) },
      ])
    } else {
      setField('isActive', true)
    }
  }

  const handleAddCard = () => {
    navigationRef.navigate(Screens.Root.UserTabs as any, {
      screen: Screens.UserTab.More,
      params: {
        screen: Screens.More.PaymentMethodEdit,
        params: {},
      },
    })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        <Text style={styles.screenTitle}>{title}</Text>

        {/* ── 가맹점명 ── */}
        <Text style={styles.label}>{s.merchantNameLabel}</Text>
        <TextInput
          style={[styles.input, merchantError && styles.inputError]}
          placeholder={s.merchantNamePlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={form.merchantName}
          onChangeText={(v) => setField('merchantName', v)}
          maxLength={50}
        />
        {merchantError && <Text style={styles.errorText}>{s.errMerchantEmpty}</Text>}

        <View style={styles.gap} />

        {/* ── 금액 ── */}
        <Text style={styles.label}>{s.amountLabel}</Text>
        <View style={[styles.amountRow, amountError && styles.inputError]}>
          <TextInput
            style={styles.amountInput}
            placeholder={s.amountPlaceholder}
            placeholderTextColor={theme.colors.text.disabled}
            value={form.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChangeText={(v) => setField('amount', v.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
          />
          <Text style={styles.amountUnit}>원</Text>
        </View>
        {amountError && <Text style={styles.errorText}>{s.errAmountEmpty}</Text>}

        <View style={styles.gap} />

        {/* ── 매월 지출일 ── */}
        <Text style={styles.label}>{s.dayOfMonthLabel}</Text>
        <TextInput
          style={[styles.input, dayError && styles.inputError]}
          placeholder={s.dayOfMonthPlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={form.dayOfMonth}
          onChangeText={(v) => {
            const n = v.replace(/[^0-9]/g, '')
            if (n === '' || (Number(n) >= 1 && Number(n) <= 31)) setField('dayOfMonth', n)
          }}
          keyboardType="number-pad"
          maxLength={2}
        />
        {dayError && <Text style={styles.errorText}>{s.errDayEmpty}</Text>}

        <View style={styles.gap} />

        {/* ── 카테고리 ── */}
        <Text style={styles.label}>{s.categoryLabel}</Text>
        <TouchableOpacity
          style={styles.pickerRow}
          onPress={() => setShowCategoryPicker(true)}
          activeOpacity={0.7}
        >
          {selectedCategory ? (
            <>
              <View style={[styles.pickerIconWrap, { backgroundColor: selectedCategory.color }]}>
                <Text style={styles.pickerIconEmoji}>{selectedCategory.icon}</Text>
              </View>
              <Text style={styles.pickerText}>{selectedCategory.name}</Text>
            </>
          ) : (
            <Text style={[styles.pickerText, styles.pickerPlaceholder]}>{s.categoryPlaceholder}</Text>
          )}
          <Text style={styles.pickerChevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.gap} />

        {/* ── 결제수단 ── */}
        <Text style={styles.label}>{s.paymentMethodLabel}</Text>
        <TouchableOpacity
          style={styles.pickerRow}
          onPress={() => setShowPaymentMethodPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.pickerText, !form.paymentMethodId && styles.pickerPlaceholder]}>
            {selectedPaymentMethod ? selectedPaymentMethod.name : s.paymentMethodPlaceholder}
          </Text>
          <Text style={styles.pickerChevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.gap} />

        {/* ── 메모 ── */}
        <Text style={styles.label}>{s.memoLabel}</Text>
        <TextInput
          style={[styles.input, styles.memoInput]}
          placeholder={s.memoPlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={form.memo}
          onChangeText={(v) => setField('memo', v)}
          multiline
          maxLength={200}
        />

        <View style={styles.gap} />

        {/* ── 자동 등록 스위치 ── */}
        <Text style={styles.label}>{s.isActiveLabel}</Text>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>{form.isActive ? strings.fixedExpenses.activeLabel : strings.fixedExpenses.inactiveLabel}</Text>
          </View>
          <Switch
            value={form.isActive}
            onValueChange={handleToggleActive}
            trackColor={{ false: theme.colors.divider, true: theme.colors.primaryLight }}
            thumbColor={form.isActive ? theme.colors.primary : theme.colors.text.disabled}
          />
        </View>

        {/* ── 저장 버튼 ── */}
        <TouchableOpacity
          style={[styles.submitBtn, isPending && styles.btnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isPending}
        >
          <Text style={styles.submitBtnText}>{s.saveButton}</Text>
        </TouchableOpacity>

        {/* ── 삭제 버튼 (수정 모드만) ── */}
        {isEdit && (
          <TouchableOpacity
            style={[styles.deleteBtn, isPending && styles.btnDisabled]}
            onPress={handleDelete}
            activeOpacity={0.8}
            disabled={isPending}
          >
            <Text style={styles.deleteBtnText}>{s.deleteButton}</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      <CategoryPickerModal
        visible={showCategoryPicker}
        selectedId={form.categoryId}
        onSelect={(id) => setField('categoryId', id)}
        onClose={() => setShowCategoryPicker(false)}
      />

      <PaymentMethodPickerModal
        mode="single"
        visible={showPaymentMethodPicker}
        selectedId={form.paymentMethodId}
        onSelect={(id) => setField('paymentMethodId', id)}
        onClose={() => setShowPaymentMethodPicker(false)}
        onAddCard={handleAddCard}
      />

    </KeyboardAvoidingView>
  )
}
