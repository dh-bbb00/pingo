export interface CategoryForm {
  name:          string
  budget:        string
  isFixedBudget: boolean
}

export interface CategoryListItem {
  id:     string
  name:   string
  color:  string
  icon:   string
  budget: number | null
}
