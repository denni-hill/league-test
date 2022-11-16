import { CustomLoggerService } from "../../custom-logger";
import { SoftDeleteByIdStrategy, SoftDeleteStage } from "../types";

export class SoftDeleteByIdExecutor<T, TId = number> {
  constructor(
    private readonly _logger: CustomLoggerService,
    private readonly _alias: string,
    private readonly _softDeleteByIdStrategy: SoftDeleteByIdStrategy<T, TId>
  ) {}

  async softDeleteById(id: TId): Promise<T> {
    let mutableId: TId = id;

    try {
      if (this._softDeleteByIdStrategy.beforeSoftDelete !== undefined) {
        const beforeSoftDeleteResult =
          await this._softDeleteByIdStrategy.beforeSoftDelete(mutableId);
        if (beforeSoftDeleteResult !== undefined)
          mutableId = beforeSoftDeleteResult as TId;
      }
    } catch (e) {
      this._logAbortError(SoftDeleteStage.BEFORE_SOFT_DELETE, e);
      throw e;
    }

    let softDeletedEntity: T;
    try {
      softDeletedEntity =
        await this._softDeleteByIdStrategy.softDeleteByIdMethod(mutableId);
    } catch (e) {
      this._logAbortError(SoftDeleteStage.SOFT_DELETE, e);
      throw e;
    }

    this._logger.info(`${this._alias} entity was successfully soft deleted!`, {
      softDeletedEntity
    });

    this._callAfterwardsProcedure(softDeletedEntity);

    return softDeletedEntity;
  }

  protected _logAbortError(stage: SoftDeleteStage, error: Error) {
    this._logger.info(
      `Soft delete process of ${this._alias} entity aborted on "${stage}" stage`,
      { stage, error }
    );
  }

  protected async _callAfterwardsProcedure(softDeletedEntity: T) {
    try {
      if (this._softDeleteByIdStrategy.afterSoftDelete !== undefined)
        await this._softDeleteByIdStrategy.afterSoftDelete(softDeletedEntity);
    } catch (e) {
      this._logger.info(
        `${SoftDeleteStage.AFTER_SOFT_DELETE} stage of ${this._alias} entity failed with exception`,
        { stage: SoftDeleteStage.AFTER_SOFT_DELETE, error: e }
      );
    }
  }
}
