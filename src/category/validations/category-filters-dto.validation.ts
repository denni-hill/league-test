import Joi from "joi";
import { nameof } from "../../core/helpers";
import { Validation, ValidationResult } from "../../core/validation";
import {
  CategoryFilters,
  CategoryFiltersRequestDTO,
  Category,
  SortDirection,
  Sort
} from "../types";

export class CategoryFiltersDTOValidation
  implements Validation<CategoryFilters>
{
  private _validationSchema = Joi.object<
    CategoryFilters,
    true,
    CategoryFiltersRequestDTO
  >({
    name: Joi.string().trim().min(1).optional(),
    description: Joi.string().trim().min(1).optional(),
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
        else return page;
      }),
    sort: Joi.string()
      .trim()
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

  private _acceptableSortValues = [
    nameof((c: Category) => c.id),
    nameof((c: Category) => c.slug),
    nameof((c: Category) => c.name),
    nameof((c: Category) => c.description),
    nameof((c: Category) => c.createdDate),
    nameof((c: Category) => c.active)
  ];

  validate(
    input: CategoryFiltersRequestDTO
  ): ValidationResult<CategoryFilters> {
    const validationResult = this._validationSchema.validate(input, {
      stripUnknown: true,
      abortEarly: false
    });

    if (
      validationResult.error === undefined &&
      validationResult.value.sort !== undefined &&
      !this._acceptableSortValues.includes(
        validationResult.value.sort.fieldName
      )
    )
      validationResult.value.sort = undefined;

    return validationResult;
  }
}
