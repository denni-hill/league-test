import { Module } from "@nestjs/common";
import { TypeormModule } from "src/typeorm";
import { CategoryService } from "./category.service";
import {
  CategoryFiltersDTOValidation,
  CreateCategoryDTOValidation,
  UpdateCategoryDTOValidation
} from "./validations";
import { CategoryController } from './category.controller';

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
