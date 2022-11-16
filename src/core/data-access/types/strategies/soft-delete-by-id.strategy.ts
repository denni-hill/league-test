export interface SoftDeleteByIdStrategy<T, TId = number> {
  beforeSoftDelete?(id: TId): void | TId | Promise<void | TId>;
  softDeleteByIdMethod(id: TId): T | Promise<T>;
  afterSoftDelete?(softDeletedEntity: T): void | Promise<void>;
}
