export type HistoryDateTab = '일' | '월' | '년'

export interface HistoryFilter {
  tab:        HistoryDateTab
  date:       Date
  isPeriod:   boolean
  periodEnd:  Date | null
}

export interface TransactionForm {
  amount:          string   // 숫자 문자열
  merchantName:    string
  categoryId:      string   // '' = null (기타)
  paymentMethodId: string   // '' = null (미지정)
  memo:            string
  transactionDate: Date
}
