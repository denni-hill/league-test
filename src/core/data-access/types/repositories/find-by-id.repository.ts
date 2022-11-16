export interface FindByIdRepository<T, TId = number> {
  findById(id: TId): T | Promise<T>;
  isExistById(id: TId): boolean | Promise<boolean>;
}
