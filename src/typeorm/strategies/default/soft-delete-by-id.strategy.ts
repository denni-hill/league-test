import { FindOneOptions, Repository } from "typeorm";
import { SoftDeleteByIdStrategy } from "../../../core/data-access";
import { NotFoundError, ValidationError } from "../../../core/errors";
import { Validation } from "../../../core/validation";
import { BaseSoftRemovableEntity } from "../../types";

export class TypeormDefaultSoftDeleteByIdStrategy<
  T extends BaseSoftRemovableEntity<TId>,
  TId = number
> implements SoftDeleteByIdStrategy<T, TId>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string,
    private readonly _idValidation: Validation<TId>
  ) {}

  async beforeSoftDelete(id: TId): Promise<TId | void> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while soft deleting ${this._alias}`
      );

    return idValidationResult.value;
  }

  async softDeleteByIdMethod(id: TId): Promise<T> {
    const entityToSoftDelete = await this._repository.findOne({
      where: { id }
    } as FindOneOptions<T>);

    if (entityToSoftDelete === null) throw new NotFoundError(this._alias);

    return await this._repository.softRemove(entityToSoftDelete);
  }
}
