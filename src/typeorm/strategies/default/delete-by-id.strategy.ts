import { FindOneOptions, Repository } from "typeorm";
import { DeleteByIdStrategy } from "../../../core/data-access";
import { NotFoundError } from "../../../core/errors";
import { BaseEntity } from "../../types";

export class TypeormDefaultDeleteByIdStrategy<
  T extends BaseEntity<TId>,
  TId = number
> implements DeleteByIdStrategy<T, TId>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string
  ) {}

  async deleteByIdMethod(id: TId): Promise<T> {
    const entityToDelete = await this._repository.findOne({
      where: { id },
      withDeleted: true
    } as FindOneOptions<T>);

    if (entityToDelete === null) throw new NotFoundError(this._alias);

    return await this._repository.remove(entityToDelete);
  }
}
