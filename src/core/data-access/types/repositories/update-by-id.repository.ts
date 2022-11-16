export interface UpdateByIdRepository<T, TId = number> {
  updateById(id: TId, data: Partial<T>): T | Promise<T>;
}
