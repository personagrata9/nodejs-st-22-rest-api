import { PaginatedItemsResult } from './paginated-items-result.interface';

export interface Repository<T> {
  findOneById(id: string): Promise<T | undefined>;
  findAll(
    limit: number,
    offset: number,
    filter: string,
  ): Promise<PaginatedItemsResult<T>>;
  create(entityDto: any): Promise<T>;
  update(id: string, entityDto: any): Promise<T>;
  delete(id: string): Promise<void>;
}
