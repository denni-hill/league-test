import Joi from "joi";
import { nameof } from "../../core/helpers";
import { Validation, ValidationResult } from "../../core/validation";
import {
  CategoryFilters,
  CategoryFiltersDTO,
  Category,
  Sort,
  SortDirection
} from "../types";

export class CategoryFiltersDTOValidation
  implements Validation<CategoryFilters>
{
  private _validationSchema: Joi.ObjectSchema<CategoryFilters>;
  private _acceptableSortValues: string[];

  validate(input: CategoryFiltersDTO): ValidationResult<CategoryFilters> {
    return this._validationSchema.validate(input, {
      stripUnknown: true,
      abortEarly: false
    });
  }

  constructor() {
    this._initAcceptableSortValues();
    this._initValidationSchema();
  }

  private _initAcceptableSortValues(): void {
    let acceptableSortValues: string[] = [
      nameof((c: Category) => c.id),
      nameof((c: Category) => c.slug),
      nameof((c: Category) => c.name),
      nameof((c: Category) => c.description),
      nameof((c: Category) => c.createdDate),
      nameof((c: Category) => c.active)
    ];

    acceptableSortValues = acceptableSortValues.concat(
      acceptableSortValues.map((fieldName) => `-${fieldName}`)
    );

    this._acceptableSortValues = acceptableSortValues;
  }

  private _initValidationSchema() {
    this._validationSchema = Joi.object<
      CategoryFilters,
      true,
      CategoryFiltersDTO
    >({
      name: Joi.string().trim().min(1).optional(),
      description: Joi.string().trim().default(null).optional(),
      active: Joi.string()
        .valid("0", "false", "1", "true")
        .custom((active: string) => {
          if (active === "0" || active === "false") return false;
          else return true;
        })
        .optional(),
      search: Joi.string().trim().min(1).optional(),
      pageSize: Joi.number().integer().min(1).default(2),
      page: Joi.number()
        .integer()
        .min(0)
        .default(1)
        .custom((page) => {
          if (page === 0) return 1;
        }),
      sort: Joi.string()
        .trim()
        .valid(...this._acceptableSortValues)
        .custom((sortValue: string): Sort => {
          if (sortValue.startsWith("-"))
            return {
              direction: SortDirection.DESC,
              fieldName: sortValue.slice(1)
            };
          else
            return {
              direction: SortDirection.ASC,
              fieldName: sortValue
            };
        })
    });
  }
}
