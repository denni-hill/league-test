import { Test, TestingModule } from "@nestjs/testing";
import { TypeormModule } from "../typeorm";
import { CategoryService } from "./category.service";
import {
  CategoryFiltersDTOValidation,
  CreateCategoryDTOValidation,
  UpdateCategoryDTOValidation
} from "./validations";

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        CategoryFiltersDTOValidation,
        CreateCategoryDTOValidation,
        UpdateCategoryDTOValidation
      ],
      imports: [TypeormModule]
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
