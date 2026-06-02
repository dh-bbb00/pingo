import { useState } from 'react'
import type { HistoryDateTab, HistoryFilter } from '../types'

export function useHistoryFilter() {
  const [filter, setFilter] = useState<HistoryFilter>({
    tab:              '일',
    date:             new Date(),
    isPeriod:         false,
    periodEnd:        null,
    categoryIds:      [],
    paymentMethodIds: [],
  })

  function setTab(tab: HistoryDateTab) {
    setFilter((prev) => ({ ...prev, tab, isPeriod: false, periodEnd: null }))
  }

  function setDate(date: Date) {
    setFilter((prev) => ({ ...prev, date }))
  }

  function togglePeriod() {
    setFilter((prev) => ({
      ...prev,
      isPeriod:  !prev.isPeriod,
      periodEnd: !prev.isPeriod ? new Date() : null,
    }))
  }

  function setPeriodEnd(date: Date) {
    setFilter((prev) => ({ ...prev, periodEnd: date }))
  }

  function setCategoryIds(ids: string[]) {
    setFilter((prev) => ({ ...prev, categoryIds: ids }))
  }

  function setPaymentMethodIds(ids: string[]) {
    setFilter((prev) => ({ ...prev, paymentMethodIds: ids }))
  }

  return { filter, setTab, setDate, togglePeriod, setPeriodEnd, setCategoryIds, setPaymentMethodIds }
}
