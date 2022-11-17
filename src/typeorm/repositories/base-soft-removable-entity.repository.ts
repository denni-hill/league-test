import { FindManyOptions, FindOneOptions, IsNull, Not } from "typeorm";
import { CustomLoggerService } from "../../core/custom-logger";
import {
  FindAllDeletedRepository,
  FindDeletedByIdRepository,
  RestoreByIdExecutor,
  RestoreByIdRepository,
  SoftDeleteByIdExecutor,
  SoftDeleteById
} from "../../core/data-access";
import { BadRequestError, NotFoundError } from "../../core/errors";
import { Validation } from "../../core/validation";
import {
  TypeormDefaultRestoreByIdStrategy,
  TypeormDefaultSoftDeleteByIdStrategy
} from "../strategies";
import { BaseSoftRemovableEntity, Connection } from "../types";
import { TypeormBaseEntityRepository } from "./base-entity.repository";

export abstract class TypeormBaseSoftRemovableEntityRepository<
    T extends BaseSoftRemovableEntity<TId>,
    TId = number
  >
  extends TypeormBaseEntityRepository<T, TId>
  implements
    SoftDeleteById<T, TId>,
    RestoreByIdRepository<T, TId>,
    FindAllDeletedRepository<T>,
    FindDeletedByIdRepository<T, TId>
{
  constructor(
    _connection: Connection,
    _alias: string,
    _entityClass: { new (): T },
    _idValidation: Validation<TId>,
    _logger: CustomLoggerService
  ) {
    super(_connection, _alias, _entityClass, _idValidation, _logger);

    this._softDeleteByIdExecutor = new SoftDeleteByIdExecutor<T, TId>(
      _logger,
      _alias,
      new TypeormDefaultSoftDeleteByIdStrategy<T, TId>(this._repository, _alias)
    );

    this._restoreByIdExecutor = new RestoreByIdExecutor<T, TId>(
      _logger,
      _alias,
      new TypeormDefaultRestoreByIdStrategy<T, TId>(this._repository, _alias)
    );
  }

  protected _softDeleteByIdExecutor: SoftDeleteByIdExecutor<T, TId>;
  protected _restoreByIdExecutor: RestoreByIdExecutor<T, TId>;

  async findAllDeleted(): Promise<T[]> {
    return await this._repository.find({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true
    } as FindManyOptions<T>);
  }

  async findDeletedById(id: TId): Promise<T> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new BadRequestError(
        idValidationResult.error,
        `id validation failed while finding deleted ${this._alias}`
      );

    const entity = await this._repository.findOne({
      where: { id },
      withDeleted: true
    } as FindOneOptions<T>);

    if (entity === null) throw new NotFoundError(this._alias);

    return entity;
  }

  async restoreById(id: TId): Promise<T> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new BadRequestError(
        idValidationResult.error,
        `id validation failed while restoring ${this._alias}`
      );

    return await this._restoreByIdExecutor.restoreById(id);
  }

  async softDeleteById(id: TId): Promise<T> {
    const idValidationResult = await this._idValidation.validate(id);
    if (idValidationResult.error)
      throw new BadRequestError(
        idValidationResult.error,
        `id validation failed while soft deleting ${this._alias}`
      );

    return await this._softDeleteByIdExecutor.softDeleteById(id);
  }
}
