export interface DeleteByIdRepository<T, TId = number> {
  deleteById(id: TId): T | Promise<T>;
}
