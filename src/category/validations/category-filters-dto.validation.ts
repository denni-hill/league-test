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
  private _acceptableSortValues = [
    nameof((c: Category) => c.id, { propertyNameOnly: true }),
    nameof((c: Category) => c.slug, { propertyNameOnly: true }),
    nameof((c: Category) => c.name, { propertyNameOnly: true }),
    nameof((c: Category) => c.description, { propertyNameOnly: true }),
    nameof((c: Category) => c.createdDate, { propertyNameOnly: true }),
    nameof((c: Category) => c.active, { propertyNameOnly: true })
  ];

  private _validationSchema = Joi.object<
    CategoryFilters,
    true,
    CategoryFiltersRequestDTO
  >({
    name: Joi.string()
      .trim()
      .min(0)
      .custom((name: string): string | undefined => {
        if (name.length === 0) return undefined;
        else return name;
      })
      .optional(),
    description: Joi.string()
      .trim()
      .min(0)
      .custom((description: string): string | undefined => {
        if (description.length === 0) return undefined;
        else return description;
      })
      .optional(),
    active: Joi.string()
      .valid("0", "false", "1", "true")
      .custom((active: string): boolean => {
        if (active === "0" || active === "false") return false;
        else return true;
      })
      .optional(),
    search: Joi.string()
      .trim()
      .min(0)
      .custom((search: string): string | undefined => {
        if (search.length === 0) return undefined;
        else return search;
      })
      .optional(),
    pageSize: Joi.number().integer().min(1).default(2),
    page: Joi.number()
      .integer()
      .min(0)
      .default(1)
      .custom((page: number): number => {
        if (page === 0) return 1;
        else return page;
      }),
    sort: Joi.string()
      .trim()
      .min(0)
      .custom((sortValue: string): Sort | undefined => {
        if (sortValue.length === 0) return undefined;

        let direction: SortDirection;
        if (sortValue.startsWith("-")) {
          direction = SortDirection.DESC;
          sortValue = sortValue.slice(1);
        } else direction = SortDirection.ASC;

        if (this._acceptableSortValues.includes(sortValue))
          return {
            direction,
            fieldName: sortValue as keyof Category
          };

        return undefined;
      })
  });

  validate(
    input: CategoryFiltersRequestDTO
  ): ValidationResult<CategoryFilters> {
    const validationResult = this._validationSchema.validate(input, {
      stripUnknown: true,
      abortEarly: false
    });

    return validationResult;
  }
}
