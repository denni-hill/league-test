import { FindOneOptions, Repository } from "typeorm";
import { DeleteByIdStrategy } from "../../../core/data-access";
import { NotFoundError, ValidationError } from "../../../core/errors";
import { Validation } from "../../../core/validation";
import { BaseEntity } from "../../types";

export class TypeormDefaultDeleteByIdStrategy<
  T extends BaseEntity<TId>,
  TId = number
> implements DeleteByIdStrategy<T, TId>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string,
    private readonly _idValidation: Validation<TId>
  ) {}

  async beforeDelete(id: TId): Promise<TId | void> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while deleting ${this._alias}`
      );

    return idValidationResult.value;
  }

  async deleteByIdMethod(id: TId): Promise<T> {
    const entityToDelete = await this._repository.findOne({
      where: { id },
      withDeleted: true
    } as FindOneOptions<T>);

    if (entityToDelete === null) throw new NotFoundError(this._alias);

    return await this._repository.remove(entityToDelete);
  }
}
