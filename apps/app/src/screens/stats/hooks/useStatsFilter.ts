import { useState, useCallback } from 'react'
import type { StatsFilter, StatsMainTab, StatsDateTab } from '../types'

function defaultRangeStart() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function useStatsFilter() {
  const [filter, setFilter] = useState<StatsFilter>({
    mainTab:                 'period',
    dateTab:                 '일',
    date:                    new Date(),
    rangeStart:              defaultRangeStart(),
    rangeEnd:                new Date(),
    selectedCategoryId:      null,
    selectedPaymentMethodId: null,
  })

  const setMainTab = useCallback((mainTab: StatsMainTab) => {
    setFilter(prev => ({ ...prev, mainTab }))
  }, [])

  const setDateTab = useCallback((dateTab: StatsDateTab) => {
    setFilter(prev => ({ ...prev, dateTab, date: new Date() }))
  }, [])

  const setRangeStart = useCallback((rangeStart: Date) => {
    setFilter(prev => ({ ...prev, rangeStart }))
  }, [])

  const setRangeEnd = useCallback((rangeEnd: Date) => {
    setFilter(prev => ({ ...prev, rangeEnd }))
  }, [])

  const setDate = useCallback((date: Date) => {
    setFilter(prev => ({ ...prev, date }))
  }, [])

  const setSelectedCategoryId = useCallback((id: string | null) => {
    setFilter(prev => ({ ...prev, selectedCategoryId: id }))
  }, [])

  const setSelectedPaymentMethodId = useCallback((id: string | null) => {
    setFilter(prev => ({ ...prev, selectedPaymentMethodId: id }))
  }, [])

  const applyParams = useCallback((params: {
    initialTab?:      StatsMainTab
    categoryId?:      string
    paymentMethodId?: string
  }) => {
    setFilter(prev => ({
      ...prev,
      ...(params.initialTab      && { mainTab: params.initialTab }),
      ...(params.categoryId      && { selectedCategoryId: params.categoryId }),
      ...(params.paymentMethodId && { selectedPaymentMethodId: params.paymentMethodId }),
    }))
  }, [])

  return {
    filter,
    setMainTab,
    setDateTab,
    setDate,
    setRangeStart,
    setRangeEnd,
    setSelectedCategoryId,
    setSelectedPaymentMethodId,
    applyParams,
  }
}
