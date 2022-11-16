export interface RestoreByIdRepository<T, TId = number> {
  restoreById(id: TId): T | Promise<T>;
}
