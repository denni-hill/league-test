import { PipeTransform, UnprocessableEntityException } from "@nestjs/common";
import { Validation } from "../types";

export abstract class ValidationPipe<TInput, TTransformed>
  implements PipeTransform<TInput, Promise<TTransformed>>
{
  constructor(private readonly _validation: Validation<TTransformed>) {}

  async transform(value: TInput): Promise<TTransformed> {
    const validationResult = await this._validation.validate(value);

    if (validationResult.error)
      throw new UnprocessableEntityException(validationResult.error);

    return validationResult.value;
  }
}
