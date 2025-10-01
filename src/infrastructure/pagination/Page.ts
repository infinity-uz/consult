export interface Page<T> {
  data: Array<T>;
  totalElements: number;
  totalPages: number;
  pageSize: number;
}
