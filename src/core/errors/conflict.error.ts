import { BaseError } from "./base-error";

export class ConflictError extends BaseError {
  constructor(details: string) {
    super(details ? "Conflict Error" : `Conflict Error: ${details}`);
  }
}
