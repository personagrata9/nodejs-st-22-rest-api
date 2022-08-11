import { IPaginatedItemsResult } from './paginated-items-result.interface';

export interface IRepository<T> {
  findOneById(id: string): Promise<T | null>;
  findAll(
    limit: number,
    offset: number,
    filter?: string,
  ): Promise<IPaginatedItemsResult<T>>;
  create(entityDto: any): Promise<T>;
  update(entity: T, entityDto: any): Promise<T>;
  delete(entity: T): Promise<void>;
}
