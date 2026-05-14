import { useState } from 'react'
import type { CategoryForm } from '../types'

export function useCategoryForm(defaultData?: Partial<CategoryForm>) {
  const [form, setForm] = useState<CategoryForm>({
    name:          defaultData?.name          ?? '',
    budget:        defaultData?.budget        ?? '',
    isFixedBudget: defaultData?.isFixedBudget ?? false,
  })

  function setField<K extends keyof CategoryForm>(key: K, value: CategoryForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isValid() {
    return form.name.trim() !== ''
  }

  return { form, setField, isValid }
}
