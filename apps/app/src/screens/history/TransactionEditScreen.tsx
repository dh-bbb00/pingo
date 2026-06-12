import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { HistoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { showConfirm } from '@/store/confirmStore'
import { useTransactionForm } from './hooks/useTransactionForm'
import { usePendingTransactionStore } from '@/store/pendingTransactionStore'
import {
  useTransactionById,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from './hooks/useTransactionEdit'
import { useCategoryById } from '@/screens/category/hooks/useCategoryById'
import { useCategoryRecommendation } from './hooks/useCategoryRecommendation'
import CategoryPickerModal from './components/CategoryPickerModal'
import PaymentMethodPickerModal from './components/PaymentMethodPickerModal'
import DateNavigator from '@/components/DateNavigator'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import { navigationRef } from '@/navigation/navigationRef'
import { Screens } from '@/constants/screens'
import { makeStyles } from './TransactionEditScreen.styles'
import { useNotificationLogStore } from '@/store/notificationLogStore'
import { parseCardNotification } from '@/utils/cardNotificationParser'

type Route = RouteProp<HistoryStackParamList, 'TransactionEdit'>
type Nav   = NativeStackNavigationProp<HistoryStackParamList, 'TransactionEdit'>

const s  = strings.transactionEdit
const sn = strings.pendingNotifications

export default function TransactionEditScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { params }       = useRoute<Route>()
  const navigation       = useNavigation<Nav>()
  const isEdit           = !!params?.id
  const notificationId   = params?.notificationId
  const title            = isEdit ? s.headerEdit : s.headerCreate

  const { data: txData } = useTransactionById(isEdit ? params?.id : undefined)
  const { form, setField, setForm, isValid } = useTransactionForm()
  const { mutate: update,  isPending: updating  } = useUpdateTransaction(params?.id ?? '')
  const { mutate: deleteTx, isPending: deleting } = useDeleteTransaction(params?.id ?? '')

  const pendingStore                = usePendingTransactionStore()
  const { data: selectedCategory } = useCategoryById(form.categoryId || undefined)
  const { data: paymentMethods }   = usePaymentMethods()
  const selectedPaymentMethod      = paymentMethods?.find(m => m.id === form.paymentMethodId)

  // 알림에서 열렸을 때 상단에 표시할 원문 텍스트
  const [notificationText, setNotificationText] = useState<string | null>(null)

  // 추천 카테고리가 자동 적용된 상태인지 추적 — 유저가 직접 변경하면 false
  const [isRecommendationApplied, setIsRecommendationApplied] = useState(false)

  const initialized         = useRef(false)
  const defaultPMApplied    = useRef(false)
  const notifInitialized    = useRef(false)
  const recommendationApplied = useRef(false)

  // 가맹점명 기반 추천 카테고리 조회 — 알림 플로우이고 폼이 초기화된 후에만 실행
  const { data: recommendedCategoryId } = useCategoryRecommendation(
    notificationId && notifInitialized.current ? form.merchantName : undefined
  )

  // 알림 등록 후 다음 알림으로 이동하거나 미등록 리스트로 복귀
  const goToPendingList = useCallback(() => {
    navigationRef.navigate(Screens.Root.UserTabs as any, {
      screen: Screens.UserTab.More,
      params: { screen: Screens.More.PendingNotifications },
    })
  }, [])

  const handleAfterNotificationCreate = useCallback(() => {
    const store = useNotificationLogStore.getState()
    store.markAsRegistered(notificationId!)

    const unregistered = store.notifications.filter(n => n.id !== notificationId)
    if (unregistered.length > 0) {
      showConfirm(sn.nextConfirmTitle, sn.nextConfirmMsg, [
        { text: sn.nextConfirmCancel, style: 'cancel', onPress: goToPendingList },
        {
          text: sn.nextConfirmOk,
          onPress: () => {
            navigation.replace(Screens.History.TransactionEdit, { notificationId: unregistered[0].id })
          },
        },
      ])
    } else {
      goToPendingList()
    }
  }, [notificationId, navigation, goToPendingList])

  const { mutate: create, isPending: creating } = useCreateTransaction(
    notificationId ? handleAfterNotificationCreate : undefined
  )

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

  // 알림 데이터 초기화 — paymentMethods 로드 후 1회 실행
  useEffect(() => {
    if (!notificationId || isEdit || notifInitialized.current || !paymentMethods) return
    const { notifications } = useNotificationLogStore.getState()
    const notification = notifications.find(n => n.id === notificationId)
    if (!notification) return
    const parsed = parseCardNotification(notification.title, notification.text)
    if (!parsed) return

    notifInitialized.current = true
    defaultPMApplied.current = true  // 기본 결제수단 자동 세팅 방지

    // 알림 원문 상단 표시용
    setNotificationText(notification.text)

    const receivedMs   = parseInt(notification.time, 10)
    const receivedDate = new Date(isNaN(receivedMs) ? Date.now() : receivedMs)
    const [month, day] = parsed.date.split('/').map(Number)
    const [hour, min]  = parsed.time.split(':').map(Number)
    let txDate = new Date(receivedDate.getFullYear(), month - 1, day, hour, min, 0, 0)
    if (txDate > new Date()) txDate.setFullYear(txDate.getFullYear() - 1)

    // 카드사+끝4자리로 결제수단 자동 매칭
    const matched   = paymentMethods.find(pm =>
      pm.cardNumber === parsed.last4 &&
      (pm.name.includes(parsed.issuer) || parsed.issuer.includes(pm.name))
    )
    const defaultPM = paymentMethods.find(m => m.isDefault)
    const pmId      = matched?.id ?? defaultPM?.id ?? ''

    setForm({
      amount:            parsed.amount.toString(),
      merchantName:      parsed.merchant,
      categoryId:        '',
      paymentMethodId:   pmId,
      memo:              '',
      transactionDate:   txDate,
      installmentMonths: parsed.isInstallment
        ? (parsed.installmentMonths != null ? parsed.installmentMonths.toString() : '')
        : '',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationId, isEdit, paymentMethods])

  // 추천 카테고리 자동 적용 — 유저가 아직 카테고리를 선택하지 않은 경우에만
  useEffect(() => {
    if (!recommendedCategoryId || form.categoryId !== '' || recommendationApplied.current) return
    recommendationApplied.current = true
    setField('categoryId', recommendedCategoryId)
    setIsRecommendationApplied(true)
  }, [recommendedCategoryId, form.categoryId, setField])

  // 신규 등록 시 기본 결제수단 자동 세팅 (1회)
  useEffect(() => {
    if (isEdit || defaultPMApplied.current || form.paymentMethodId !== '') return
    const defaultMethod = paymentMethods?.find(m => m.isDefault)
    if (defaultMethod) {
      defaultPMApplied.current = true
      setField('paymentMethodId', defaultMethod.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethods])

  // edit 모드에서 기존 데이터를 폼에 1회 세팅
  useEffect(() => {
    if (isEdit && txData && !initialized.current) {
      initialized.current = true
      setForm({
        amount:            (txData.installmentMonths != null && txData.totalAmount != null)
                             ? txData.totalAmount.toString()
                             : txData.amount.toString(),
        merchantName:      txData.merchantName,
        categoryId:        txData.categoryId      ?? '',
        paymentMethodId:   txData.paymentMethodId ?? '',
        memo:              txData.memo            ?? '',
        transactionDate:   new Date(txData.transactionDate),
        installmentMonths: txData.installmentMonths != null ? txData.installmentMonths.toString() : '',
      })
    }
  }, [txData, isEdit, setForm])

  const [showCategoryPicker,       setShowCategoryPicker]       = useState(false)
  const [showPaymentMethodPicker,  setShowPaymentMethodPicker]  = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isPending             = creating || updating || deleting
  const isInstallmentEnabled  = parseInt(form.amount || '0', 10) >= 50000

  const amountError   = submitted && form.amount === ''            ? s.errAmountEmpty
                      : submitted && parseInt(form.amount, 10) <= 0 ? s.errAmountZero
                      : undefined
  const merchantError = submitted && form.merchantName.trim() === '' ? s.errMerchantEmpty : undefined

  const handleSubmit = () => {
    setSubmitted(true)
    if (!isValid()) return
    if (isEdit) update(form)
    else        create(form)
  }

  const handleDelete = () => {
    showConfirm(s.deleteConfirmTitle, s.deleteConfirmMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: s.deleteBtn, style: 'destructive', onPress: () => deleteTx() },
    ])
  }

  const handleCategorySelect = (id: string) => {
    setField('categoryId', id)
    // 유저가 직접 카테고리를 바꾸면 추천 표시 해제
    setIsRecommendationApplied(false)
  }

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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        <Text style={styles.screenTitle}>{title}</Text>

        {/* ── 감지된 알림 원문 배너 ── */}
        {notificationText && (
          <View style={styles.notifBanner}>
            <Text style={styles.notifBannerLabel}>{s.notifBannerLabel}</Text>
            <Text style={styles.notifBannerText}>{notificationText}</Text>
          </View>
        )}

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

        <View style={styles.smallGap} />

        {/* ── 할부 (금액 5만원 이상일 때만 활성화) ── */}
        <Text style={styles.label}>{s.installmentLabel}</Text>
        <View style={[styles.installmentRow, !isInstallmentEnabled && styles.installmentDisabled]}>
          <TextInput
            style={styles.installmentInput}
            placeholder={s.installmentLumpSum}
            placeholderTextColor={theme.colors.text.disabled}
            value={form.installmentMonths}
            onChangeText={(v) => setField('installmentMonths', v.replace(/[^0-9]/g, ''))}
            onBlur={() => {
              if (!form.installmentMonths || parseInt(form.installmentMonths, 10) <= 0) {
                setField('installmentMonths', '')
              }
            }}
            keyboardType="number-pad"
            editable={isInstallmentEnabled}
          />
          {form.installmentMonths !== '' && (
            <Text style={styles.installmentUnit}>개월</Text>
          )}
        </View>

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
        {isRecommendationApplied && (
          <Text style={styles.recommendedBadge}>{s.categoryRecommended}</Text>
        )}

        <View style={styles.gap} />

        {/* ── 결제수단 (선택) ── */}
        <Text style={styles.label}>{s.paymentMethodLabel}</Text>
        <TouchableOpacity
          style={styles.pickerRow}
          onPress={() => setShowPaymentMethodPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.pickerText, !form.paymentMethodId && styles.pickerPlaceholder]}>
            {selectedPaymentMethod
              ? selectedPaymentMethod.cardNumber
                ? `${selectedPaymentMethod.name} (${selectedPaymentMethod.cardNumber})`
                : selectedPaymentMethod.name
              : s.paymentMethodPlaceholder}
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
        onSelect={handleCategorySelect}
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
