import { FindOneOptions, Repository } from "typeorm";
import { SoftDeleteByIdStrategy } from "../../../core/data-access";
import { NotFoundError } from "../../../core/errors";
import { BaseSoftRemovableEntity } from "../../types";

export class TypeormDefaultSoftDeleteByIdStrategy<
  T extends BaseSoftRemovableEntity<TId>,
  TId = number
> implements SoftDeleteByIdStrategy<T, TId>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string
  ) {}

  async softDeleteByIdMethod(id: TId): Promise<T> {
    const entityToSoftDelete = await this._repository.findOne({
      where: { id }
    } as FindOneOptions<T>);

    if (entityToSoftDelete === null) throw new NotFoundError(this._alias);

    return await this._repository.softRemove(entityToSoftDelete);
  }
}
