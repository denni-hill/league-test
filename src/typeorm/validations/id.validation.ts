import Joi from "joi";
import { Validation, ValidationResult } from "../../core/validation";

export class IntegerIdValidation implements Validation<number> {
  private readonly _validationSchema = Joi.number().integer().min(1);

  validate(input: any): ValidationResult<number> {
    return this._validationSchema.validate(input, { abortEarly: false });
  }
}
