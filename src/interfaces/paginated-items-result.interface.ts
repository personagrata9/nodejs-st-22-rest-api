export interface IPaginatedItemsResult<T> {
  items: T[];
  limit: number;
  offset: number;
  count: number;
}
