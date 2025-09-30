export interface ISuccess {
  statusCode: number;
  message: string;
  data: object;
}

export interface IResponsePagination extends ISuccess {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  from: number;
  to: number;
}

export interface IFindOptions<T> {
  where?: Partial<T>;
  select?: Partial<Record<keyof T, boolean>>;
  relations?: Record<string, boolean>;
  page?: number;
  pageSize?: number;
}
