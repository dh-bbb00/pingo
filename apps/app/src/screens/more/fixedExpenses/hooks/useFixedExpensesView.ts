import { useState } from 'react'
import type { FixedExpensesViewTab } from '@/api/endpoints/fixedExpenses.api'

export function useFixedExpensesView() {
  const [activeTab, setActiveTab] = useState<FixedExpensesViewTab>('리스트')

  return { activeTab, setActiveTab }
}
