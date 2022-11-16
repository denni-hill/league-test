import { FindOneOptions, Repository } from "typeorm";
import { SoftDeleteByIdStrategy } from "../../../core/data-access";
import { NotFoundError, ValidationError } from "../../../core/errors";
import { BaseSoftRemovableEntity } from "../../types";
import { IntegerIdValidation } from "../../validations/id.validation";

export class TypeormDefaultSoftDeleteByIdStrategy<
  T extends BaseSoftRemovableEntity
> implements SoftDeleteByIdStrategy<T>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string,
    private readonly _idValidation: IntegerIdValidation
  ) {}

  beforeSoftDelete(id: number): number | void | Promise<number | void> {
    const idValidationResult = this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while soft deleting ${this._alias}`
      );

    return idValidationResult.value;
  }

  async softDeleteByIdMethod(id: number): Promise<T> {
    const entityToSoftDelete = await this._repository.findOne({
      where: { id }
    } as FindOneOptions<T>);

    if (entityToSoftDelete === null) throw new NotFoundError(this._alias);

    return await this._repository.softRemove(entityToSoftDelete);
  }
}
