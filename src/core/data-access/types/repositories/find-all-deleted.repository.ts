export interface FindAllDeletedRepository<T> {
  findAllDeleted(): T[] | Promise<T[]>;
}
