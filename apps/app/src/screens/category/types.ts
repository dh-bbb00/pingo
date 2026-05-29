export interface CategoryForm {
  name:          string
  budget:        string
  isFixedBudget: boolean
  icon:          string
  color:         string
}

export type CategorySort =
  | 'budget_asc' | 'budget_desc'
  | 'name_asc'   | 'name_desc'
  | 'date_asc'   | 'date_desc'
