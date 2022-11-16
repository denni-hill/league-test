export interface FindDeletedByIdRepository<T, TId = number> {
  findDeletedById(id: TId): T | Promise<T>;
}
