import { useState } from 'react'
import type { TransactionForm } from '../types'
import { startOfDay } from '@/utils/date'

export function useTransactionForm(defaultData?: Partial<TransactionForm>) {
  const [form, setForm] = useState<TransactionForm>({
    amount:            defaultData?.amount            ?? '',
    merchantName:      defaultData?.merchantName      ?? '',
    categoryId:        defaultData?.categoryId        ?? '',
    paymentMethodId:   defaultData?.paymentMethodId   ?? '',
    memo:              defaultData?.memo              ?? '',
    transactionDate:   defaultData?.transactionDate   ?? startOfDay(new Date()),
    installmentMonths: defaultData?.installmentMonths ?? '',
  })

  function setField<K extends keyof TransactionForm>(key: K, value: TransactionForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      // 금액이 5만원 미만으로 바뀌면 할부 자동 초기화
      if (key === 'amount' && parseInt(String(value) || '0', 10) < 50000) {
        next.installmentMonths = ''
      }
      return next
    })
  }

  function isValid() {
    return form.amount !== '' && parseInt(form.amount, 10) > 0 && form.merchantName.trim() !== ''
  }

  return { form, setField, setForm, isValid }
}
