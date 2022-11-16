import {
  CreateRepository,
  DeleteByIdRepository,
  FindByIdRepository,
  UpdateByIdRepository
} from "../../core/data-access";
import { Category } from "./category";
import { CategoryFilters } from "./category-filters";

export abstract class CategoryRepository
  implements
    CreateRepository<Category>,
    FindByIdRepository<Category, string>,
    UpdateByIdRepository<Category, string>,
    DeleteByIdRepository<Category, string>
{
  abstract create(data: Category): Category | Promise<Category>;
  abstract findById(id: string): Category | Promise<Category>;
  abstract updateById(
    id: string,
    data: Partial<Category>
  ): Category | Promise<Category>;
  abstract deleteById(id: string): Category | Promise<Category>;

  abstract findBySlug(slug: string): Category | Promise<Category>;
  abstract findByFilters(
    filters: CategoryFilters
  ): Category[] | Promise<Category[]>;

  abstract isExistBySlug(slug: string): boolean | Promise<boolean>;
  abstract isExistById(id: string): boolean | Promise<boolean>;
}
