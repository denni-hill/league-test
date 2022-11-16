import { BaseError } from "./base-error";

export class ValidationError extends BaseError {
  constructor(private readonly _cause: Error, details?: string) {
    super(details ? "Validation Error" : `Validation Error: ${details}`);
  }

  get cause(): Error {
    return this._cause;
  }
}
