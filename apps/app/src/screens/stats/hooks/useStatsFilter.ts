import { useState } from 'react'
import type { StatsDateTab, StatsFilter } from '../types'

export function useStatsFilter() {
  const [filter, setFilter] = useState<StatsFilter>({
    tab:  '일',
    date: new Date(),
  })

  function setTab(tab: StatsDateTab) {
    setFilter({ tab, date: new Date() })
  }

  function setDate(date: Date) {
    setFilter((prev) => ({ ...prev, date }))
  }

  return { filter, setTab, setDate }
}
