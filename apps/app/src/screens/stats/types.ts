export type StatsDateTab = '일' | '월' | '년'

export interface StatsFilter {
  tab:  StatsDateTab
  date: Date
}

export interface ChartDataPoint {
  value: number
  label: string
}

export interface CategoryStat {
  categoryId:   string
  categoryName: string
  amount:       number
  percentage:   number
}

export interface TopPlace {
  name:       string
  amount:     number
  changeRate: number | null
}
