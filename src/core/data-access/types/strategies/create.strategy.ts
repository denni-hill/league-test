export interface CreateStrategy<T> {
  beforeValidate?(dto: any): void | any | Promise<void | any>;
  validateMethod?(dto: any): void | any | Promise<void | any>;
  beforeCreate?(dto: any): void | any | Promise<void | any>;
  createMethod(dto: any): T | Promise<T>;
  afterCreate?(entity: T): void | Promise<void>;
}
