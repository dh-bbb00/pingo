import { create } from 'zustand'
import type { TransactionForm } from '@/api/endpoints/transactions.api'

interface PendingTransactionState {
  pendingForm:        TransactionForm | null
  newPaymentMethodId: string | null
  save:               (form: TransactionForm) => void
  setNewPaymentMethodId: (id: string) => void
  clear:              () => void
}

export const usePendingTransactionStore = create<PendingTransactionState>((set) => ({
  pendingForm:        null,
  newPaymentMethodId: null,

  save:  (form) => set({ pendingForm: form }),
  setNewPaymentMethodId: (id) => set({ newPaymentMethodId: id }),
  clear: () => set({ pendingForm: null, newPaymentMethodId: null }),
}))
