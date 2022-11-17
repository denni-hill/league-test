import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { UpdateByIdStrategy } from "../../../core/data-access";
import { NotFoundError } from "../../../core/errors";
import { BaseEntity } from "../../types";

export class TypeormDefaultUpdateByIdStrategy<
  T extends BaseEntity<TId>,
  TId = number
> implements UpdateByIdStrategy<T, TId>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string
  ) {}

  async updateMethod(id: TId, dto: DeepPartial<T>): Promise<T> {
    const entityToUpdate = await this._repository.findOne({
      where: { id }
    } as FindOneOptions<T>);

    if (entityToUpdate === null) throw new NotFoundError(this._alias);

    const mergedEntity = this._repository.merge(entityToUpdate, dto);
    return await this._repository.save(mergedEntity);
  }
}
