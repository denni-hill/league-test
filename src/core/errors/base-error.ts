export class BaseError {
  constructor(private readonly _message: string) {}

  get message() {
    return this._message;
  }
}
