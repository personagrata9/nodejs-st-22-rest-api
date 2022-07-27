export interface Repository<T> {
  findOneById(id: string): Promise<T | undefined>;
  findAll(limit: number, offset: number, filter: string): Promise<T[]>;
  count(filter?: string): Promise<number>;
  create(entityDto: any): Promise<T>;
  update(id: string, entityDto: any): Promise<T>;
  delete(id: string): Promise<void>;
}
