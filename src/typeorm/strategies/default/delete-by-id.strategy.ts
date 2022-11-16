import Joi from "joi";
import { FindOneOptions, Repository } from "typeorm";
import { DeleteByIdStrategy } from "../../../core/data-access";
import { NotFoundError, ValidationError } from "../../../core/errors";
import { BaseEntity } from "../../types";

export class TypeormDefaultDeleteByIdStrategy<T extends BaseEntity>
  implements DeleteByIdStrategy<T>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string
  ) {}

  async beforeDelete(id: number): Promise<number | void> {
    const idValidationResult = Joi.number().integer().min(1).validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while deleting ${this._alias}`
      );

    return idValidationResult.value;
  }

  async deleteByIdMethod(id: number): Promise<T> {
    const entityToDelete = await this._repository.findOne({
      where: { id },
      withDeleted: true
    } as FindOneOptions<T>);

    if (entityToDelete === null) throw new NotFoundError(this._alias);

    return await this._repository.remove(entityToDelete);
  }
}
