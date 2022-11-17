import { Injectable } from "@nestjs/common";
import { ConflictError, NotFoundError, ValidationError } from "../core/errors";
import {
  Category,
  CategoryFilters,
  CategoryFiltersRequestDTO,
  CategoryRepository,
  CreateCategoryRequestDTO,
  UpdateCategoryRequestDTO
} from "./types";
import {
  CategoryFiltersDTOValidation,
  CreateCategoryDTOValidation,
  UpdateCategoryDTOValidation
} from "./validations";

@Injectable()
export class CategoryService {
  public static readonly dtoValidationFailedErrorMessage =
    "category data validation failed";
  public static readonly slugConflictErrorMessage =
    "category with given slug is already exist";
  public static readonly filtersValidationFailedErrorMessage =
    "category filters validation failed";

  constructor(
    private readonly _cateogryRepository: CategoryRepository,
    private readonly _createCategoryDTOValidation: CreateCategoryDTOValidation,
    private readonly _updateCategoryDTOValidation: UpdateCategoryDTOValidation,
    private readonly _categoryFiltersDTOValidation: CategoryFiltersDTOValidation
  ) {}

  async createCategory(createCategoryDTO: CreateCategoryRequestDTO) {
    const dtoValidationResult =
      this._createCategoryDTOValidation.validate(createCategoryDTO);
    if (dtoValidationResult.error)
      throw new ValidationError(
        dtoValidationResult.error,
        CategoryService.dtoValidationFailedErrorMessage
      );

    const validCategoryDTO = dtoValidationResult.value as Category;

    if (await this._cateogryRepository.isExistBySlug(validCategoryDTO.slug)) {
      throw new ConflictError(CategoryService.slugConflictErrorMessage);
    }

    return await this._cateogryRepository.create(validCategoryDTO);
  }

  async updateCategoryById(
    id: string,
    updateCategoryDTO: UpdateCategoryRequestDTO
  ): Promise<Category> {
    const dtoValidationResult =
      this._updateCategoryDTOValidation.validate(updateCategoryDTO);
    if (dtoValidationResult.error)
      throw new ValidationError(
        dtoValidationResult.error,
        CategoryService.dtoValidationFailedErrorMessage
      );

    const validCategoryDTO = dtoValidationResult.value as Partial<Category>;

    if (!(await this._cateogryRepository.isExistById(id)))
      throw new NotFoundError("category");

    if (validCategoryDTO.slug !== undefined) {
      const sameSlugCategory = await this._cateogryRepository.findBySlug(
        validCategoryDTO.slug
      );

      if (sameSlugCategory !== null && sameSlugCategory.id !== id)
        throw new ConflictError(CategoryService.slugConflictErrorMessage);
    }
    return await this._cateogryRepository.updateById(id, validCategoryDTO);
  }

  async deleteCategoryById(id: string): Promise<Category> {
    return await this._cateogryRepository.deleteById(id);
  }

  async findCategoryByIdOrSlug(idOrSlug: string): Promise<Category> {
    const uuidMathPattern =
      /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

    let category: Category | null;

    if (uuidMathPattern.test(idOrSlug))
      category = await this._cateogryRepository.findById(idOrSlug);
    else category = await this._cateogryRepository.findBySlug(idOrSlug);

    if (category === null) throw new NotFoundError("category");

    return category;
  }

  async findCategoriesByFilter(
    categoryFiltersDTO: CategoryFiltersRequestDTO
  ): Promise<Category[]> {
    const filtersValidationResult =
      this._categoryFiltersDTOValidation.validate(categoryFiltersDTO);

    if (filtersValidationResult.error)
      throw new ValidationError(
        filtersValidationResult.error,
        CategoryService.filtersValidationFailedErrorMessage
      );

    const validFiltersDTO = filtersValidationResult.value as CategoryFilters;

    return await this._cateogryRepository.findByFilters(validFiltersDTO);
  }
}
