import { useState } from 'react'
import type { FixedExpenseForm } from '@/api/endpoints/fixedExpenses.api'

export function useFixedExpenseForm(defaultData?: Partial<FixedExpenseForm>) {
  const [form, setForm] = useState<FixedExpenseForm>({
    merchantName:    defaultData?.merchantName    ?? '',
    amount:          defaultData?.amount          ?? '',
    categoryId:      defaultData?.categoryId      ?? '',
    paymentMethodId: defaultData?.paymentMethodId ?? '',
    memo:            defaultData?.memo            ?? '',
    dayOfMonth:      defaultData?.dayOfMonth      ?? '',
    isActive:        defaultData?.isActive        ?? true,
  })

  function setField<K extends keyof FixedExpenseForm>(key: K, value: FixedExpenseForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isValid() {
    return form.merchantName.trim() !== '' && form.amount !== '' && form.dayOfMonth !== ''
  }

  return { form, setField, setForm, isValid }
}
