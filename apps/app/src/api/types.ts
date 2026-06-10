export interface BasicResponse<T> {
  success: boolean
  data:    T
  message?: string
}

export interface ListResponse<T> {
  success: boolean
  data:    T[]
  message?: string
}

export interface PageResponse<T> {
  success:    boolean
  data:       T[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}
