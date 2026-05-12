export type BasicResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ListResponse<T> = {
  success: boolean;
  data: T[];
  message?: string;
};

export type PageResponse<T> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message?: string;
};
