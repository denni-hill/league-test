import { Injectable } from "@nestjs/common";
import { ConflictError, NotFoundError, ValidationError } from "../core/errors";
import {
  Category,
  CategoryFiltersDTO,
  CategoryRepository,
  CreateCategoryDTO,
  UpdateCategoryDTO
} from "./types";
import {
  CreateCategoryDTOValidation,
  UpdateCategoryDTOValidation
} from "./validations";

@Injectable()
export class CategoryService {
  private readonly _dtoValidationFailedErrorMessage =
    "category data validation failed";
  private readonly _slugConflictErrorMessage =
    "category with given slug is already exist";

  constructor(
    private readonly _cateogryRepository: CategoryRepository,
    private readonly _createCategoryDTOValidation: CreateCategoryDTOValidation,
    private readonly _updateCategoryDTOValidation: UpdateCategoryDTOValidation
  ) {}

  async createCategory(createCategoryDTO: CreateCategoryDTO) {
    const dtoValidationResult =
      this._createCategoryDTOValidation.validate(createCategoryDTO);
    if (dtoValidationResult.error)
      throw new ValidationError(
        dtoValidationResult.error,
        this._dtoValidationFailedErrorMessage
      );

    const validCategoryDTO = dtoValidationResult.value;

    if (await this._cateogryRepository.isExistBySlug(validCategoryDTO.slug)) {
      throw new ConflictError(this._slugConflictErrorMessage);
    }

    return await this._cateogryRepository.create(validCategoryDTO);
  }

  async updateCategoryById(
    id: string,
    updateCategoryDTO: UpdateCategoryDTO
  ): Promise<Category> {
    const dtoValidationResult =
      this._updateCategoryDTOValidation.validate(updateCategoryDTO);
    if (dtoValidationResult.error)
      throw new ValidationError(
        dtoValidationResult.error,
        this._dtoValidationFailedErrorMessage
      );

    const validCategoryDTO = dtoValidationResult.value;

    if (!(await this._cateogryRepository.isExistById(id)))
      throw new NotFoundError("category");

    if (validCategoryDTO.slug !== undefined) {
      const sameSlugCategory = await this._cateogryRepository.findBySlug(
        validCategoryDTO.slug
      );

      if (sameSlugCategory.id !== id)
        throw new ConflictError(this._slugConflictErrorMessage);
    }

    return await this._cateogryRepository.updateById(id, validCategoryDTO);
  }

  async deleteCategoryById(id: string): Promise<Category> {
    return;
  }

  async getCategoriesByFilter(
    categoryFiltersDTO: CategoryFiltersDTO
  ): Promise<Category> {
    return;
  }
}
