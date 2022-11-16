import { DeepPartial, Repository } from "typeorm";
import { CreateStrategy } from "../../../core/data-access";
import { BaseEntity } from "../../types";

export class TypeormDefaultCreateStrategy<T extends BaseEntity>
  implements CreateStrategy<T>
{
  constructor(private readonly _repository: Repository<T>) {}
  async createMethod(dto: DeepPartial<T>): Promise<T> {
    return await this._repository.save(this._repository.create(dto));
  }
}
