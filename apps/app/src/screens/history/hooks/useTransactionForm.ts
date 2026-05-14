import { useState } from 'react'
import type { TransactionForm } from '../types'

export function useTransactionForm(defaultData?: Partial<TransactionForm>) {
  const [form, setForm] = useState<TransactionForm>({
    amount:      defaultData?.amount      ?? '',
    description: defaultData?.description ?? '',
    categoryId:  defaultData?.categoryId  ?? '',
    date:        defaultData?.date        ?? new Date(),
  })

  function setField<K extends keyof TransactionForm>(key: K, value: TransactionForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isValid() {
    return form.amount !== '' && form.categoryId !== ''
  }

  return { form, setField, isValid }
}
