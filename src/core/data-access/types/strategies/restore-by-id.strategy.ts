export interface RestoreByIdStrategy<T, TId = number> {
  beforeRestore?(id: TId): void | TId | Promise<void | TId>;
  restoreByIdMethod(id: TId): T | Promise<T>;
  afterRestore?(restoredEntity: T): void | Promise<void>;
}
