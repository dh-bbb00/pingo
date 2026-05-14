export type HistoryDateTab = '일' | '월' | '년'

export interface HistoryFilter {
  tab:        HistoryDateTab
  date:       Date
  isPeriod:   boolean
  periodEnd:  Date | null
}

export interface TransactionForm {
  amount:      string
  description: string
  categoryId:  string
  date:        Date
}
