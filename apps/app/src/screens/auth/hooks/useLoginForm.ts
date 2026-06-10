import { useState } from 'react'
import { storage, StorageKeys } from '@/utils/storage'
import type { LoginForm } from '@/api/endpoints/auth.api'

export function useLoginForm() {
  const [form, setForm] = useState<LoginForm>({
    email:     storage.getString(StorageKeys.SAVED_EMAIL) ?? '',
    password:  '',
    saveEmail: !!storage.getString(StorageKeys.SAVED_EMAIL),
    autoLogin: storage.getBoolean(StorageKeys.AUTO_LOGIN) ?? false,
  })

  function setField<K extends keyof LoginForm>(key: K, value: LoginForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function persistPreferences() {
    if (form.saveEmail) {
      storage.set(StorageKeys.SAVED_EMAIL, form.email)
    } else {
      storage.remove(StorageKeys.SAVED_EMAIL)
    }
    storage.set(StorageKeys.AUTO_LOGIN, form.autoLogin)
  }

  return { form, setField, persistPreferences }
}
