import { BaseError } from "./base-error";

export class BadRequestError extends BaseError {
  constructor(private readonly _cause: Error, details?: string) {
    super(details ? `Bad Request: ${details}` : "Bad Request");
  }

  get cause(): Error {
    return this._cause;
  }
}
