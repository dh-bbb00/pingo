export type StatsMainTab = 'period' | 'category' | 'paymentMethod'
export type StatsDateTab = '일' | '월' | '년' | '기간'

export const DATE_TAB = {
  DAY:    '일',
  MONTH:  '월',
  YEAR:   '년',
  RANGE:  '기간',
} as const satisfies Record<string, StatsDateTab>


export interface StatsFilter {
  mainTab:                 StatsMainTab
  dateTab:                 StatsDateTab
  date:                    Date
  rangeStart:              Date
  rangeEnd:                Date
  selectedCategoryId:      string | null
  selectedPaymentMethodId: string | null
}
