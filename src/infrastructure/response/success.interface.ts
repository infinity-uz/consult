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

export interface IFindOptions<T, W = any> {
  where?: W;
  select?: Partial<Record<keyof T, boolean>>;
  relations?: Record<string, boolean>;
  orderBy?:any
  page?: number;
  pageSize?: number;
}

