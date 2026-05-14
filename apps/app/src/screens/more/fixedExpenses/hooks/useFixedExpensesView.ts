import { useState } from 'react'
import type { FixedExpensesViewTab } from '../types'

export function useFixedExpensesView() {
  const [activeTab, setActiveTab] = useState<FixedExpensesViewTab>('리스트')

  return { activeTab, setActiveTab }
}
