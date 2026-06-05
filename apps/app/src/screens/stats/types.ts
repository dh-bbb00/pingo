export type StatsMainTab = 'period' | 'category' | 'paymentMethod'
export type StatsDateTab = '일' | '월' | '년'

export interface StatsFilter {
  mainTab:                 StatsMainTab
  dateTab:                 StatsDateTab
  date:                    Date
  selectedCategoryId:      string | null
  selectedPaymentMethodId: string | null
}
