import { BaseError } from "./base-error";

export class NotFoundError extends BaseError {
  constructor(alias: string) {
    super(`${alias} not found`);
  }
}
