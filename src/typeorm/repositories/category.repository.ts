import { Injectable } from "@nestjs/common";
import { Brackets } from "typeorm";
import {
  Category,
  CategoryFilters,
  CategoryRepository
} from "../../category/types";
import { CustomLoggerService } from "../../core/custom-logger";
import { CategoryEntity } from "../entities";
import { Connection } from "../types";
import { UUIDValidation } from "../validations/uuid.validation";
import { TypeormBaseEntityRepository } from "./base-entity.repository";

@Injectable()
export class TypeormCategoryRepository
  extends TypeormBaseEntityRepository<CategoryEntity, string>
  implements CategoryRepository
{
  constructor(
    connection: Connection,
    idValidation: UUIDValidation,
    logger: CustomLoggerService
  ) {
    super(connection, "category", CategoryEntity, idValidation, logger);
  }
  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this._repository.findOne({
      where: {
        slug
      }
    });

    return category;
  }

  async findByFilters(filters: CategoryFilters): Promise<Category[]> {
    const builder = this._repository.createQueryBuilder("category");

    if (filters.search !== undefined) {
      builder.andWhere(
        new Brackets((whereBuilder) => {
          whereBuilder.orWhere("category.name ~* :search", {
            search: this._handleCyrillicLetterYo(filters.search as string)
          });
          whereBuilder.orWhere("category.description ~* :search", {
            search: this._handleCyrillicLetterYo(filters.search as string)
          });
        })
      );
    } else {
      if (filters.name !== undefined)
        builder.andWhere("category.name ~* :name", {
          name: `${this._handleCyrillicLetterYo(filters.name)}`
        });

      if (filters.description !== undefined)
        builder.andWhere("category.description ~* :description", {
          description: this._handleCyrillicLetterYo(filters.description)
        });
    }

    if (filters.active !== undefined)
      builder.andWhere("category.active = :active", { active: filters.active });

    let { page, pageSize } = filters;

    if (pageSize === undefined) pageSize = 2;
    builder.limit(pageSize);

    if (page === undefined || page === 0) page = 1;
    builder.offset(pageSize * (page - 1));

    if (filters.sort !== undefined)
      builder.orderBy(
        `category.${filters.sort.fieldName}`,
        filters.sort.direction
      );
    else builder.orderBy("category.createdDate", "DESC");

    return await builder.getMany();
  }
  async isExistBySlug(slug: string): Promise<boolean> {
    return (
      (await this._repository.count({
        where: {
          slug
        }
      })) > 0
    );
  }

  private _handleCyrillicLetterYo(searchStr: string): string {
    return searchStr.replace(/[её]/g, "[е|ё]");
  }
}
