import Joi from "joi";
import { FindOneOptions, IsNull, Not, Repository } from "typeorm";
import { RestoreByIdStrategy } from "../../../core/data-access";
import { NotFoundError, ValidationError } from "../../../core/errors";
import { BaseSoftRemovableEntity } from "../../types";

export class TypeormDefaultRestoreByIdStrategy<
  T extends BaseSoftRemovableEntity
> implements RestoreByIdStrategy<T>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string
  ) {}

  beforeRestore(id: number): number | void | Promise<number | void> {
    const idValidationResult = Joi.number().integer().min(1).validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while restoring ${this._alias}`
      );

    return idValidationResult.value;
  }
  async restoreByIdMethod(id: number): Promise<T> {
    const entityToRestore = await this._repository.findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true
    } as FindOneOptions<T>);

    if (entityToRestore === null) throw new NotFoundError(this._alias);

    return await this._repository.recover(entityToRestore);
  }
}
