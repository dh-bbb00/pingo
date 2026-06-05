export type StatsMainTab = 'period' | 'category' | 'paymentMethod'
export type StatsDateTab = '일' | '월' | '년' | '기간'


export interface StatsFilter {
  mainTab:                 StatsMainTab
  dateTab:                 StatsDateTab
  date:                    Date
  rangeStart:              Date
  rangeEnd:                Date
  selectedCategoryId:      string | null
  selectedPaymentMethodId: string | null
}
