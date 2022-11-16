export interface CreateRepository<T> {
  create(data: T): T | Promise<T>;
}
