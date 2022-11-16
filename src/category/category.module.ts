import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryFiltersDTOValidation } from "./validations";

@Module({
  providers: [CategoryService, CategoryFiltersDTOValidation]
})
export class CategoryModule {}
