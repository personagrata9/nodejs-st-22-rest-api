export interface PaginatedItemsResult<T> {
  items: T[];
  limit: number;
  offset: number;
  count: number;
}
