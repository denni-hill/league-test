import Joi from "joi";
import { nameof } from "../../core/helpers";
import { Validation, ValidationResult } from "../../core/validation";
import { Category } from "../types";
import { CreateCategoryDTO } from "../types/dto/request/create-category.dto";

const categoryDTOValidationSchema = Joi.object<Category, false, Category>({
  slug: Joi.string().trim().min(1).optional(),
  name: Joi.string().trim().min(1).optional(),
  description: Joi.string().trim().min(1).optional()
});

export class CreateCategoryDTOValidation implements Validation<Category> {
  private readonly _validationSchema = categoryDTOValidationSchema.fork(
    [
      nameof((c: Category) => c.slug, { fieldNameOnly: true }),
      nameof((c: Category) => c.name, { fieldNameOnly: true })
    ],
    (fieldSchema) => fieldSchema.required()
  );

  validate(input: CreateCategoryDTO): ValidationResult<Category> {
    return this._validationSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    });
  }
}

export class UpdateCategoryDTOValidation
  implements Validation<Partial<Category>>
{
  private readonly _validationSchema = categoryDTOValidationSchema;

  validate(input: any): ValidationResult<Partial<Category>> {
    return this._validationSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    });
  }
}
