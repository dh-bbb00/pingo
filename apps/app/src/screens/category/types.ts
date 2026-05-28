export interface CategoryForm {
  name:          string
  budget:        string
  isFixedBudget: boolean
  icon:          string
  color:         string
}

export interface CategoryListItem {
  id:           string
  name:         string
  color:        string
  icon:         string
  budget:       number | null
  isBudgetFixed: boolean
}
