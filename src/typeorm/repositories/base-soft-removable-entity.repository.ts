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
import {
  TypeormDefaultRestoreByIdStrategy,
  TypeormDefaultSoftDeleteByIdStrategy
} from "../strategies";
import { BaseSoftRemovableEntity, Connection } from "../types";
import { BaseEntityRepository } from "./base-entity.repository";

export abstract class BaseSoftRemovableEntityRepository<
    T extends BaseSoftRemovableEntity
  >
  extends BaseEntityRepository<T>
  implements
    SoftDeleteById<T, number>,
    RestoreByIdRepository<T, number>,
    FindAllDeletedRepository<T>,
    FindDeletedByIdRepository<T, number>
{
  constructor(
    _connection: Connection,
    _alias: string,
    _entityClass: { new (): T },
    _logger: CustomLoggerService
  ) {
    super(_connection, _alias, _entityClass, _logger);

    this._softDeleteByIdExecutor = new SoftDeleteByIdExecutor<T, number>(
      _logger,
      _alias,
      new TypeormDefaultSoftDeleteByIdStrategy<T>(this._repository, _alias)
    );

    this._restoreByIdExecutor = new RestoreByIdExecutor<T, number>(
      _logger,
      _alias,
      new TypeormDefaultRestoreByIdStrategy<T>(this._repository, _alias)
    );
  }

  protected _softDeleteByIdExecutor: SoftDeleteByIdExecutor<T, number>;
  protected _restoreByIdExecutor: RestoreByIdExecutor<T, number>;

  async findAllDeleted(): Promise<T[]> {
    return await this._repository.find({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true
    } as FindManyOptions<T>);
  }

  async findDeletedById(id: number): Promise<T> {
    return await this._repository.findOne({
      where: { id },
      withDeleted: true
    } as FindOneOptions<T>);
  }

  async restoreById(id: number): Promise<T> {
    return await this._restoreByIdExecutor.restoreById(id);
  }

  async softDeleteById(id: number): Promise<T> {
    return await this._softDeleteByIdExecutor.softDeleteById(id);
  }
}
