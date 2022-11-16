import { CustomLoggerService } from "../../custom-logger";
import { UpdateStage, UpdateByIdStrategy } from "../types";

export class UpdateByIdExecutor<T, TId = number> {
  constructor(
    private readonly _logger: CustomLoggerService,
    private readonly _alias: string,
    private readonly _updateByIdStrategy: UpdateByIdStrategy<T, TId>
  ) {}

  async update<DTO>(id: TId, dto: DTO): Promise<T> {
    let mutableData: { id: TId; dto: any } = { id, dto };

    try {
      if (this._updateByIdStrategy.beforeValidate !== undefined) {
        const beforeValidateResult =
          await this._updateByIdStrategy.beforeValidate(
            mutableData.id,
            mutableData.dto
          );
        if (beforeValidateResult !== undefined)
          mutableData = beforeValidateResult as { id: TId; dto: any };
      }
    } catch (e) {
      this._logAbortError(UpdateStage.BEFORE_VALIDATE, e);
      throw e;
    }

    try {
      if (this._updateByIdStrategy.validateMethod !== undefined) {
        const validateResult = await this._updateByIdStrategy.validateMethod(
          mutableData.id,
          mutableData.dto
        );
        if (validateResult !== undefined)
          mutableData = validateResult as { id: TId; dto: any };
      }
    } catch (e) {
      this._logAbortError(UpdateStage.VALIDATE, e);
      throw e;
    }

    try {
      if (this._updateByIdStrategy.beforeUpdate !== undefined) {
        const beforeUpdateResult = await this._updateByIdStrategy.beforeUpdate(
          mutableData.id,
          mutableData.dto
        );
        if (beforeUpdateResult !== undefined)
          mutableData = beforeUpdateResult as { id: TId; dto: any };
      }
    } catch (e) {
      this._logAbortError(UpdateStage.BEFORE_UPDATE, e);
      throw e;
    }

    let updatedEntity: T;
    try {
      updatedEntity = await this._updateByIdStrategy.updateMethod(
        mutableData.id,
        mutableData.dto
      );
    } catch (e) {
      this._logAbortError(UpdateStage.UPDATE, e);
      throw e;
    }

    this._logger.info(`${this._alias} was successfully updated!`, {
      updatedEntity
    });

    this._callAfterwardsProcedure(updatedEntity);

    return updatedEntity;
  }

  protected _logAbortError(stage: UpdateStage, error: Error) {
    this._logger.info(
      `Update process of "${this._alias}" entity aborted on "${stage}" stage`,
      { stage, error }
    );
  }

  protected async _callAfterwardsProcedure(updatedEntity: T) {
    try {
      if (this._updateByIdStrategy.afterUpdate !== undefined)
        await this._updateByIdStrategy.afterUpdate(updatedEntity);
    } catch (e) {
      this._logger.info(
        `${UpdateStage.AFTER_UPDATE} stage of ${this._alias} entity failed with exception`,
        { stage: UpdateStage.AFTER_UPDATE, error: e }
      );
    }
  }
}
