import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { HistoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useTransactionForm } from './hooks/useTransactionForm'
import { usePendingTransactionStore } from '@/store/pendingTransactionStore'
import {
  useTransactionById,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from './hooks/useTransactionEdit'
import { useCategoryById } from '@/screens/category/hooks/useCategoryById'
import CategoryPickerModal from './components/CategoryPickerModal'
import PaymentMethodPickerModal from './components/PaymentMethodPickerModal'
import DateNavigator from '@/components/DateNavigator'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'
import { makeStyles } from './TransactionEditScreen.styles'

type Route = RouteProp<HistoryStackParamList, 'TransactionEdit'>

const s = strings.transactionEdit

export default function TransactionEditScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { params } = useRoute<Route>()
  const isEdit = !!params?.id
  const title  = isEdit ? s.headerEdit : s.headerCreate

  const { data: txData } = useTransactionById(isEdit ? params?.id : undefined)
  const { form, setField, setForm, isValid } = useTransactionForm()
  const { mutate: create,  isPending: creating  } = useCreateTransaction()
  const { mutate: update,  isPending: updating  } = useUpdateTransaction(params?.id ?? '')
  const { mutate: deleteTx, isPending: deleting } = useDeleteTransaction(params?.id ?? '')

  const initialized = useRef(false)

  // 결제수단 등록 후 복귀: 저장된 폼 + 새 결제수단 ID 복원 (1회 실행)
  useEffect(() => {
    if (pendingStore.pendingForm && !initialized.current) {
      initialized.current = true
      setForm({
        ...pendingStore.pendingForm,
        ...(pendingStore.newPaymentMethodId && { paymentMethodId: pendingStore.newPaymentMethodId }),
      })
      pendingStore.clear()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // edit 모드에서 기존 데이터를 폼에 1회 세팅
  useEffect(() => {
    if (isEdit && txData && !initialized.current) {
      initialized.current = true
      setForm({
        amount:          txData.amount.toString(),
        merchantName:    txData.merchantName,
        categoryId:      txData.categoryId      ?? '',
        paymentMethodId: txData.paymentMethodId ?? '',
        memo:            txData.memo            ?? '',
        transactionDate: new Date(txData.transactionDate),
      })
    }
  }, [txData, isEdit, setForm])

  const pendingStore = usePendingTransactionStore()

  const { data: selectedCategory } = useCategoryById(form.categoryId || undefined)
  const { data: paymentMethods }   = usePaymentMethods()
  const selectedPaymentMethod      = paymentMethods?.find(m => m.id === form.paymentMethodId)

  const [showCategoryPicker,       setShowCategoryPicker]       = useState(false)
  const [showPaymentMethodPicker,  setShowPaymentMethodPicker]  = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isPending = creating || updating || deleting

  const amountError   = submitted && form.amount === ''          ? s.errAmountEmpty   : undefined
  const merchantError = submitted && form.merchantName.trim() === '' ? s.errMerchantEmpty : undefined

  const handleSubmit = () => {
    setSubmitted(true)
    if (!isValid()) return
    if (isEdit) update(form)
    else        create(form)
  }

  const handleDelete = () => {
    Alert.alert(s.deleteConfirmTitle, s.deleteConfirmMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: s.deleteBtn, style: 'destructive', onPress: () => deleteTx() },
    ])
  }

  // 결제수단 피커에서 "등록하기" 클릭 → 현재 폼 저장 후 카드 등록 화면으로 이동
  const handleAddCard = () => {
    pendingStore.save(form)
    navigationRef.navigate(Screens.Root.UserTabs as any, {
      screen: Screens.UserTab.More,
      params: {
        screen: Screens.More.PaymentMethodEdit,
        params: { returnToTransaction: true },
      },
    })
  }

  const prevDay = () => {
    const d = new Date(form.transactionDate); d.setDate(d.getDate() - 1); setField('transactionDate', d)
  }
  const nextDay = () => {
    const d = new Date(form.transactionDate); d.setDate(d.getDate() + 1); setField('transactionDate', d)
  }
  const setDate = (d: Date) => setField('transactionDate', d)

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <Text style={styles.screenTitle}>{title}</Text>

        {/* ── 날짜 ── */}
        <Text style={styles.label}>{s.dateLabel}</Text>
        <DateNavigator
          date={form.transactionDate}
          onChange={setDate}
          onPrev={prevDay}
          onNext={nextDay}
          variant="card"
          showTime
        />

        <View style={styles.gap} />

        {/* ── 카테고리 아이콘 (카테고리 선택 시 금액 위 표시) ── */}
        {selectedCategory && (
          <View style={styles.categoryIconArea}>
            <View style={[styles.categoryIconCircle, { backgroundColor: selectedCategory.color }]}>
              <Text style={styles.categoryIconEmoji}>{selectedCategory.icon}</Text>
            </View>
          </View>
        )}

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
            returnKeyType="next"
          />
          <Text style={styles.amountUnit}>원</Text>
        </View>
        {amountError && <Text style={styles.errorText}>{amountError}</Text>}

        <View style={styles.gap} />

        {/* ── 가맹점 ── */}
        <Text style={styles.label}>{s.merchantLabel}</Text>
        <TextInput
          style={[styles.input, merchantError && styles.inputError]}
          placeholder={s.merchantPlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={form.merchantName}
          onChangeText={(v) => setField('merchantName', v)}
          returnKeyType="next"
          maxLength={50}
        />
        {merchantError && <Text style={styles.errorText}>{merchantError}</Text>}

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
            <Text style={[styles.pickerText, styles.pickerPlaceholder]}>
              {form.categoryId === '' ? s.noCategoryLabel : s.categoryLabel}
            </Text>
          )}
          <Text style={styles.pickerChevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.gap} />

        {/* ── 결제수단 (선택) ── */}
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

        {/* ── 메모 (선택) ── */}
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

        {/* ── 등록/수정 버튼 ── */}
        <TouchableOpacity
          style={[styles.submitBtn, isPending && styles.btnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isPending}
        >
          <Text style={styles.submitBtnText}>{isEdit ? s.update : s.submit}</Text>
        </TouchableOpacity>

        {/* ── 삭제 버튼 (수정 모드만) ── */}
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

      <CategoryPickerModal
        visible={showCategoryPicker}
        selectedId={form.categoryId}
        onSelect={(id) => setField('categoryId', id)}
        onClose={() => setShowCategoryPicker(false)}
      />

      <PaymentMethodPickerModal
        visible={showPaymentMethodPicker}
        selectedId={form.paymentMethodId}
        onSelect={(id) => setField('paymentMethodId', id)}
        onClose={() => setShowPaymentMethodPicker(false)}
        onAddCard={handleAddCard}
      />
    </KeyboardAvoidingView>
  )
}
