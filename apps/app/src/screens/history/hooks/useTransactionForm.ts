import { useState } from 'react'
import type { TransactionForm } from '../types'
import { startOfDay } from '@/utils/date'

export function useTransactionForm(defaultData?: Partial<TransactionForm>) {
  const [form, setForm] = useState<TransactionForm>({
    amount:          defaultData?.amount          ?? '',
    merchantName:    defaultData?.merchantName    ?? '',
    categoryId:      defaultData?.categoryId      ?? '',
    paymentMethodId: defaultData?.paymentMethodId ?? '',
    memo:            defaultData?.memo            ?? '',
    transactionDate: defaultData?.transactionDate ?? startOfDay(new Date()),
  })

  function setField<K extends keyof TransactionForm>(key: K, value: TransactionForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isValid() {
    return form.amount !== '' && parseInt(form.amount, 10) > 0 && form.merchantName.trim() !== ''
  }

  return { form, setField, setForm, isValid }
}
