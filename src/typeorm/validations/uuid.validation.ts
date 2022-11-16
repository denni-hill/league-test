import { Injectable } from "@nestjs/common";
import Joi from "joi";
import { Validation, ValidationResult } from "../../core/validation";

@Injectable()
export class UUIDValidation implements Validation<string> {
  private readonly _validationSchema = Joi.string().uuid();

  validate(input: any): ValidationResult<string> {
    return this._validationSchema.validate(input, { abortEarly: false });
  }
}
