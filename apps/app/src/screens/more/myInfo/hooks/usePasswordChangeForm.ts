import { useState } from 'react'
import { strings } from '@/constants/strings'

const s = strings.passwordChange

interface PasswordChangeForm {
  current: string
  next:    string
  confirm: string
}

type Field = keyof PasswordChangeForm

export function usePasswordChangeForm() {
  const [form, setForm] = useState<PasswordChangeForm>({ current: '', next: '', confirm: '' })
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [serverErrors, setServerErrors] = useState<Partial<Record<Field, string>>>({})

  function setField(key: Field, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (serverErrors[key]) setServerErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function markTouched(key: Field) {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  function setServerError(key: Field, message: string) {
    setServerErrors((prev) => ({ ...prev, [key]: message }))
  }

  function getLocalErrors(): Partial<Record<Field, string>> {
    const errors: Partial<Record<Field, string>> = {}
    if (!form.current)                   errors.current = s.errCurrentEmpty
    if (!form.next)                      errors.next    = s.errNextEmpty
    else if (form.next.length < 8)       errors.next    = s.errNextShort
    if (!form.confirm)                   errors.confirm = s.errConfirmEmpty
    else if (form.next !== form.confirm) errors.confirm = s.errConfirmMismatch
    return errors
  }

  function getVisibleErrors(): Partial<Record<Field, string>> {
    const local = getLocalErrors()
    const visible: Partial<Record<Field, string>> = {}
    const fields: Field[] = ['current', 'next', 'confirm']
    for (const f of fields) {
      if (serverErrors[f])                            visible[f] = serverErrors[f]
      else if ((touched[f] || submitted) && local[f]) visible[f] = local[f]
    }
    return visible
  }

  function trySubmit(onValid: () => void) {
    setSubmitted(true)
    if (Object.keys(getLocalErrors()).length === 0) onValid()
  }

  return { form, setField, markTouched, setServerError, getVisibleErrors, trySubmit }
}
