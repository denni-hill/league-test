export interface FindAllRepository<T> {
  findAll(): T[] | Promise<T[]>;
}
