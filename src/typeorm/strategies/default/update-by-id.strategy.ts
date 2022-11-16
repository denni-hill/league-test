import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { UpdateByIdStrategy } from "../../../core/data-access";
import { NotFoundError, ValidationError } from "../../../core/errors";
import { BaseEntity } from "../../types";
import { IntegerIdValidation } from "../../validations";

export class TypeormDefaultUpdateStrategy<T extends BaseEntity>
  implements UpdateByIdStrategy<T, number>
{
  constructor(
    private readonly _repository: Repository<T>,
    private readonly _alias: string,
    private readonly _idValidation: IntegerIdValidation
  ) {}
  validateMethod(id: number, dto: any): { id: number; dto: any } {
    const idValidationResult = this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while updating ${this._alias}`
      );

    return { id: idValidationResult.value, dto };
  }

  async updateMethod(id: number, dto: DeepPartial<T>): Promise<T> {
    const entityToUpdate = await this._repository.findOne({
      where: { id }
    } as FindOneOptions<T>);

    if (entityToUpdate === null)
      throw new NotFoundError(`${this._alias} entity not found!`);

    const mergedEntity = this._repository.merge(entityToUpdate, dto);
    return await this._repository.save(mergedEntity);
  }
}
