import { useState } from 'react'
import type { FixedExpenseForm } from '../types'

export function useFixedExpenseForm(defaultData?: Partial<FixedExpenseForm>) {
  const [form, setForm] = useState<FixedExpenseForm>({
    name:       defaultData?.name       ?? '',
    amount:     defaultData?.amount     ?? '',
    categoryId: defaultData?.categoryId ?? '',
    billingDay: defaultData?.billingDay ?? '',
  })

  function setField<K extends keyof FixedExpenseForm>(key: K, value: FixedExpenseForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isValid() {
    return form.name !== '' && form.amount !== '' && form.billingDay !== ''
  }

  return { form, setField, isValid }
}
