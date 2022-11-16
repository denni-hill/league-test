import { Test, TestingModule } from "@nestjs/testing";
import { TypeormModule } from "../typeorm";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import {
  CategoryFiltersDTOValidation,
  CreateCategoryDTOValidation,
  UpdateCategoryDTOValidation
} from "./validations";

describe("CategoryController", () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeormModule],
      controllers: [CategoryController],
      providers: [
        CategoryService,
        CategoryFiltersDTOValidation,
        CreateCategoryDTOValidation,
        UpdateCategoryDTOValidation
      ]
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
