export interface UpdateByIdStrategy<T, TId = number> {
  beforeValidate?(
    id: TId,
    dto: any
  ): void | { id: TId; dto: any } | Promise<void | { id: TId; dto: any }>;
  validateMethod?(
    id: TId,
    dto: any
  ): void | { id: TId; dto: any } | Promise<void | { id: TId; dto: any }>;
  beforeUpdate?(
    id: TId,
    dto: any
  ): void | { id: TId; dto: any } | Promise<void | { id: TId; dto: any }>;
  updateMethod(id: TId, dto: any): T | Promise<T>;
  afterUpdate?(entity: T): void | Promise<void>;
}
