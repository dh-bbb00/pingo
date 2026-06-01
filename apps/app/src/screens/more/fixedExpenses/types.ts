export type FixedExpensesViewTab = '리스트' | '달력'

export interface FixedExpenseForm {
  merchantName:    string
  amount:          string
  categoryId:      string
  paymentMethodId: string
  memo:            string
  dayOfMonth:      string
  isActive:        boolean
}

export interface FixedExpenseDetail {
  id:              string
  merchantName:    string
  amount:          number
  categoryId:      string
  paymentMethodId: string | null
  memo:            string | null
  dayOfMonth:      number
  isActive:        boolean
  category:        { id: string; name: string; icon: string; color: string }
  paymentMethod:   { id: string; name: string; type: string } | null
}
