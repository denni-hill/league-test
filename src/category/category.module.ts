import { Module } from "@nestjs/common";
import { TypeormModule } from "../typeorm";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import {
  CategoryFiltersDTOValidation,
  CreateCategoryDTOValidation,
  UpdateCategoryDTOValidation
} from "./validations";

@Module({
  imports: [TypeormModule],
  providers: [
    CategoryFiltersDTOValidation,
    CreateCategoryDTOValidation,
    UpdateCategoryDTOValidation,
    CategoryService
  ],
  controllers: [CategoryController]
})
export class CategoryModule {}
