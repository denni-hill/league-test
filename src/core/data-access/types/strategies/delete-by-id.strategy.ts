export interface DeleteByIdStrategy<T, TId = number> {
  beforeDelete?(id: TId): void | TId | Promise<void | TId>;
  deleteByIdMethod(id: TId): T | Promise<T>;
  afterDelete?(deletedEntity: T): void | Promise<void>;
}
