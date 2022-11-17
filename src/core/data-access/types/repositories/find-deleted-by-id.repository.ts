export interface FindDeletedByIdRepository<T, TId = number> {
  findDeletedById(id: TId): T | null | Promise<T | null>;
  isDeletedExistById(id: TId): boolean | Promise<boolean>;
}
