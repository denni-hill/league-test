import { BaseError } from "./base-error";

export class ValidationError extends BaseError {
  constructor(private readonly _cause: Error, details?: string) {
    super(details ? `Validation Error: ${details}` : "Validation Error");
  }

  get cause(): Error {
    return this._cause;
  }
}
