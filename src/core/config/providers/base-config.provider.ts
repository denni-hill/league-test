import { InternalServerErrorException } from "@nestjs/common";

export abstract class BaseConfigProvider<T> {
  protected abstract _validatorFunction(): { value?: T; error?: Error };

  protected _validateConfig(): void {
    const validationResult = this._validatorFunction();
    if (validationResult.error)
      throw new InternalServerErrorException(
        `Config validation failed for ${
          (this as object).constructor.name
        }${"\n"}${validationResult.error}`
      );
  }
}
