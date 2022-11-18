import Joi from "joi";
import { nameof } from "../../core/helpers";
import { Validation, ValidationResult } from "../../core/validation";
import { Category, UpdateCategoryRequestDTO } from "../types";
import { CreateCategoryRequestDTO } from "../types/dto/request/create-category.request.dto";

const categoryDTOValidationSchema = Joi.object<
  Category,
  true,
  CreateCategoryRequestDTO | UpdateCategoryRequestDTO
>({
  slug: Joi.string()
    .trim()
    .min(1)
    .regex(/^[A-z]+$/)
    .optional(),
  name: Joi.string()
    .trim()
    .min(1)
    .regex(/^[А-яA-zё ]+$/)
    .optional(),
  description: Joi.string()
    .trim()
    .min(1)
    .regex(/^[А-яA-zё ]+$/)
    .optional(),
  active: Joi.boolean().optional()
}).required();

export class CreateCategoryDTOValidation implements Validation<Category> {
  private readonly _validationSchema = categoryDTOValidationSchema.fork(
    [
      nameof((c: Category) => c.slug, { propertyNameOnly: true }),
      nameof((c: Category) => c.name, { propertyNameOnly: true }),
      nameof((c: Category) => c.active, { propertyNameOnly: true })
    ],
    (fieldSchema) => fieldSchema.required()
  );

  validate(input: CreateCategoryRequestDTO): ValidationResult<Category> {
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
