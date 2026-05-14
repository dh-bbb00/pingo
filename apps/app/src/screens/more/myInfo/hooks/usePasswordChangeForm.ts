import { useState } from 'react'

interface PasswordChangeForm {
  current: string
  next:    string
  confirm: string
}

export function usePasswordChangeForm() {
  const [form, setForm] = useState<PasswordChangeForm>({
    current: '',
    next:    '',
    confirm: '',
  })

  function setField<K extends keyof PasswordChangeForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isValid() {
    return form.current !== '' && form.next !== '' && form.next === form.confirm
  }

  return { form, setField, isValid }
}
