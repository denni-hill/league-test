import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { CustomLoggerService } from "../../core/custom-logger";
import {
  CreateExecutor,
  CreateRepository,
  DeleteByIdExecutor,
  DeleteByIdRepository,
  FindAllRepository,
  FindByIdRepository,
  UpdateByIdExecutor,
  UpdateByIdRepository
} from "../../core/data-access";
import { NotFoundError, ValidationError } from "../../core/errors";
import { Validation } from "../../core/validation";
import {
  TypeormDefaultCreateStrategy,
  TypeormDefaultDeleteByIdStrategy,
  TypeormDefaultUpdateByIdStrategy
} from "../strategies";
import { BaseEntity, Connection } from "../types";

export abstract class TypeormBaseEntityRepository<
  T extends BaseEntity<TId>,
  TId = number
> implements
    CreateRepository<T>,
    FindAllRepository<T>,
    FindByIdRepository<T, TId>,
    UpdateByIdRepository<T, TId>,
    DeleteByIdRepository<T, TId>
{
  constructor(
    protected readonly _connection: Connection,
    protected readonly _alias: string,
    protected readonly _entityClass: { new (): T },
    protected readonly _idValidation: Validation<TId>,
    protected readonly _logger: CustomLoggerService
  ) {
    this._createExecutor = new CreateExecutor<T>(
      _logger,
      _alias,
      new TypeormDefaultCreateStrategy<T>(this._repository)
    );

    this._updateExecutor = new UpdateByIdExecutor<T, TId>(
      _logger,
      _alias,
      new TypeormDefaultUpdateByIdStrategy<T, TId>(this._repository, _alias)
    );

    this._deleteByIdExecutor = new DeleteByIdExecutor<T, TId>(
      _logger,
      _alias,
      new TypeormDefaultDeleteByIdStrategy<T, TId>(this._repository, _alias)
    );
  }

  protected _createExecutor: CreateExecutor<T>;
  protected _updateExecutor: UpdateByIdExecutor<T, TId>;
  protected _deleteByIdExecutor: DeleteByIdExecutor<T, TId>;

  async create(data: T): Promise<T> {
    return await this._createExecutor.create(data);
  }

  async findById(id: TId): Promise<T> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while finding ${this._alias}`
      );

    const entity = await this._repository.findOne({
      where: { id }
    } as FindOneOptions<T>);

    if (entity === null) throw new NotFoundError(this._alias);

    return entity;
  }

  async isExistById(id: TId): Promise<boolean> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while checking ${this._alias} for existence`
      );

    return (
      (await this._repository.count({
        where: { id }
      } as FindManyOptions<T>)) > 0
    );
  }

  async findAll(): Promise<T[]> {
    return await this._repository.find();
  }

  async updateById(id: TId, data: Partial<T>): Promise<T> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while updating ${this._alias}`
      );

    return await this._updateExecutor.update(id, data);
  }

  async deleteById(id: TId): Promise<T> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new ValidationError(
        idValidationResult.error,
        `id validation failed while deleting ${this._alias}`
      );

    return await this._deleteByIdExecutor.deleteById(id);
  }

  protected get _repository(): Repository<T> {
    return this._connection.dataSource.getRepository<T>(this._entityClass);
  }
}
