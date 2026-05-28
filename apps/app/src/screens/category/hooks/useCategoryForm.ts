import { useState } from 'react'
import type { CategoryForm } from '../types'

const DEFAULT_ICON  = '🏷️'
const DEFAULT_COLOR = '#5B7BFB'

export function useCategoryForm(defaultData?: Partial<CategoryForm>) {
  const [form, setForm] = useState<CategoryForm>({
    name:          defaultData?.name          ?? '',
    budget:        defaultData?.budget        ?? '',
    isFixedBudget: defaultData?.isFixedBudget ?? false,
    icon:          defaultData?.icon          ?? DEFAULT_ICON,
    color:         defaultData?.color         ?? DEFAULT_COLOR,
  })

  function setField<K extends keyof CategoryForm>(key: K, value: CategoryForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isValid() {
    return form.name.trim() !== ''
  }

  return { form, setField, isValid }
}
