import { CustomLoggerService } from "../../custom-logger";
import { CreateStage, CreateStrategy } from "../types";

export class CreateExecutor<T> {
  constructor(
    private readonly _logger: CustomLoggerService,
    private readonly _alias: string,
    private readonly _createStrategy: CreateStrategy<T>
  ) {}

  async create<DTO>(dto: DTO): Promise<T> {
    let mutableDTO: any = dto;

    try {
      if (this._createStrategy.beforeValidate !== undefined) {
        const beforeValidateResult = await this._createStrategy.beforeValidate(
          mutableDTO
        );
        if (beforeValidateResult !== undefined)
          mutableDTO = beforeValidateResult;
      }
    } catch (e) {
      this._logAbortError(CreateStage.BEFORE_VALIDATE, e);
      throw e;
    }

    try {
      if (this._createStrategy.validateMethod !== undefined) {
        const validateResult = await this._createStrategy.validateMethod(
          mutableDTO
        );
        if (validateResult !== undefined) mutableDTO = validateResult;
      }
    } catch (e) {
      this._logAbortError(CreateStage.VALIDATE, e);
      throw e;
    }

    let entity: T;
    try {
      entity = await this._createStrategy.createMethod(mutableDTO);
    } catch (e) {
      this._logAbortError(CreateStage.CREATE, e);
      throw e;
    }

    this._logger.info(`${this._alias} entity was successfully created!`, {
      entity
    });

    this._callAfterwardsProcedure(entity);

    return entity;
  }

  protected _logAbortError(stage: CreateStage, error: Error) {
    this._logger.info(
      `Create process of ${this._alias} entity aborted on "${stage}" stage`,
      { stage, error }
    );
  }

  protected async _callAfterwardsProcedure(createdEntity: T) {
    try {
      if (this._createStrategy.afterCreate !== undefined)
        await this._createStrategy.afterCreate(createdEntity);
    } catch (e) {
      this._logger.info(
        `${CreateStage.AFTER_CREATE} stage of ${this._alias} entity failed with exception`,
        { stage: CreateStage.AFTER_CREATE, error: e }
      );
    }
  }
}
