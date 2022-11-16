import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import {
  CategoryFiltersRequestDTO,
  CategoryResponseDTO,
  CreateCategoryRequestDTO,
  UpdateCategoryRequestDTO
} from "./types";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @ApiResponse({ status: 201, type: CategoryResponseDTO })
  @ApiResponse({
    status: 422,
    description: CategoryService.dtoValidationFailedErrorMessage
  })
  @ApiResponse({
    status: 409,
    description: CategoryService.slugConflictErrorMessage
  })
  @ApiOperation({ summary: "Create category" })
  @Post()
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryRequestDTO
  ): Promise<CategoryResponseDTO> {
    return await this._categoryService.createCategory(createCategoryDTO);
  }

  @ApiResponse({ status: 200, type: CategoryResponseDTO })
  @ApiResponse({
    status: 422,
    description: CategoryService.dtoValidationFailedErrorMessage
  })
  @ApiResponse({
    status: 409,
    description: CategoryService.slugConflictErrorMessage
  })
  @ApiOperation({ summary: "Update category" })
  @Patch(":id")
  async updateCategory(
    @Param("id") id: string,
    @Body() updateCategoryDTO: UpdateCategoryRequestDTO
  ): Promise<CategoryResponseDTO> {
    return await this._categoryService.updateCategoryById(
      id,
      updateCategoryDTO
    );
  }

  @ApiResponse({
    status: 200,
    type: CategoryResponseDTO
  })
  @ApiResponse({
    status: 422,
    description: CategoryService.dtoValidationFailedErrorMessage
  })
  @ApiResponse({
    status: 422,
    description: "id validation failed"
  })
  @ApiOperation({ summary: "Delete category" })
  @Delete(":id")
  async deleteCategory(@Param("id") id: string): Promise<CategoryResponseDTO> {
    return await this._categoryService.deleteCategoryById(id);
  }

  @ApiResponse({
    status: 200,
    type: CategoryResponseDTO
  })
  @ApiResponse({ status: 404, description: "category not found" })
  @ApiOperation({ summary: "Get category by id or slug" })
  @Get(":idOrSlug")
  async getCategoryByIdOrSlug(
    @Param("idOrSlug") idOrSlug: string
  ): Promise<CategoryResponseDTO> {
    return await this._categoryService.findCategoryByIdOrSlug(idOrSlug);
  }

  @ApiResponse({
    status: 200,
    type: [CategoryResponseDTO]
  })
  @ApiResponse({
    status: 422,
    description: CategoryService.filtersValidationFailedErrorMessage
  })
  @ApiOperation({ summary: "Get categories by filters" })
  @Get()
  async getCategories(
    @Query() categoryFilters: CategoryFiltersRequestDTO
  ): Promise<CategoryResponseDTO[]> {
    return await this._categoryService.findCategoriesByFilter(categoryFilters);
  }
}
