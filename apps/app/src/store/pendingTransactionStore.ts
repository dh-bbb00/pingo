import { create } from 'zustand'
import type { TransactionForm } from '@/api/endpoints/transactions.api'

interface PendingTransactionState {
  pendingForm:        TransactionForm | null
  newPaymentMethodId: string | null
  newCategoryId:      string | null
  save:               (form: TransactionForm) => void
  setNewPaymentMethodId: (id: string) => void
  setNewCategoryId:   (id: string) => void
  clear:              () => void
}

export const usePendingTransactionStore = create<PendingTransactionState>((set) => ({
  pendingForm:        null,
  newPaymentMethodId: null,
  newCategoryId:      null,

  save:  (form) => set({ pendingForm: form }),
  setNewPaymentMethodId: (id) => set({ newPaymentMethodId: id }),
  setNewCategoryId:   (id) => set({ newCategoryId: id }),
  clear: () => set({ pendingForm: null, newPaymentMethodId: null, newCategoryId: null }),
}))
