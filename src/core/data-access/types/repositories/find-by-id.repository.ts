export interface FindByIdRepository<T, TId = number> {
  findById(id: TId): T | null | Promise<T | null>;
  isExistById(id: TId): boolean | Promise<boolean>;
}
