export interface SoftDeleteById<T, TId = number> {
  softDeleteById(id: TId): T | Promise<T>;
}
