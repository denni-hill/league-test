import { FindOneOptions, IsNull, Not, Repository } from "typeorm";
import { RestoreByIdStrategy } from "../../../core/data-access";
import { NotFoundError, ValidationError } from "../../../core/errors";
import { Validation } from "../../../core/validation";
import { BaseSoftRemovableEntity } from "../../types";

export class TypeormDefaultRestoreByIdStrategy<
  T extends BaseSoftRemovableEntity<TId>,
  TId = number
> implements RestoreByIdStrategy<T, TId>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string,
    private readonly _idValidation: Validation<TId>
  ) {}

  async beforeRestore(id: TId): Promise<TId | void> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while restoring ${this._alias}`
      );

    return idValidationResult.value;
  }
  async restoreByIdMethod(id: TId): Promise<T> {
    const entityToRestore = await this._repository.findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true
    } as FindOneOptions<T>);

    if (entityToRestore === null) throw new NotFoundError(this._alias);

    return await this._repository.recover(entityToRestore);
  }
}
