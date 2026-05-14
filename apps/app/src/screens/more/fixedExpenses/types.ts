export type FixedExpensesViewTab = '리스트' | '달력'

export interface FixedExpenseForm {
  name:       string
  amount:     string
  categoryId: string
  billingDay: string
}

export interface FixedExpenseDetail {
  id:         string
  name:       string
  amount:     number
  categoryId: string
  billingDay: number
}
