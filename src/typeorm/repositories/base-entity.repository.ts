import { FindOneOptions, Repository } from "typeorm";
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
import {
  TypeormDefaultCreateStrategy,
  TypeormDefaultDeleteByIdStrategy,
  TypeormDefaultUpdateStrategy
} from "../strategies";
import { BaseEntity, Connection } from "../types";

export abstract class BaseEntityRepository<T extends BaseEntity>
  implements
    CreateRepository<T>,
    FindAllRepository<T>,
    FindByIdRepository<T, number>,
    UpdateByIdRepository<T, number>,
    DeleteByIdRepository<T, number>
{
  constructor(
    private readonly _connection: Connection,
    _alias: string,
    private readonly _entityClass: { new (): T },
    _logger: CustomLoggerService
  ) {
    this._createExecutor = new CreateExecutor<T>(
      _logger,
      _alias,
      new TypeormDefaultCreateStrategy<T>(this._repository)
    );

    this._updateExecutor = new UpdateByIdExecutor<T>(
      _logger,
      _alias,
      new TypeormDefaultUpdateStrategy<T>(this._repository, _alias)
    );

    this._deleteByIdExecutor = new DeleteByIdExecutor<T>(
      _logger,
      _alias,
      new TypeormDefaultDeleteByIdStrategy<T>(this._repository, _alias)
    );
  }

  protected _createExecutor: CreateExecutor<T>;
  protected _updateExecutor: UpdateByIdExecutor<T, number>;
  protected _deleteByIdExecutor: DeleteByIdExecutor<T, number>;

  async create(data: T): Promise<T> {
    return await this._createExecutor.create(data);
  }

  async findById(id: number): Promise<T> {
    return await this._repository.findOne({
      where: { id }
    } as FindOneOptions<T>);
  }

  async findAll(): Promise<T[]> {
    return await this._repository.find();
  }

  async updateById(id: number, data: Partial<T>): Promise<T> {
    return await this._updateExecutor.update(id, data);
  }

  async deleteById(id: number): Promise<T> {
    return await this._deleteByIdExecutor.deleteById(id);
  }

  protected get _repository(): Repository<T> {
    return this._connection.dataSource.getRepository<T>(this._entityClass);
  }
}
