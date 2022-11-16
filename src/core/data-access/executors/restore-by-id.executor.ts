import { CustomLoggerService } from "../../custom-logger";
import { RestoreByIdStrategy, RestoreStage } from "../types";

export class RestoreByIdExecutor<T, TId = number> {
  constructor(
    private readonly _logger: CustomLoggerService,
    private readonly _alias: string,
    private readonly _restoreByIdStrategy: RestoreByIdStrategy<T, TId>
  ) {}

  async restoreById(id: TId): Promise<T> {
    let mutableId: TId = id;

    try {
      if (this._restoreByIdStrategy.beforeRestore !== undefined) {
        const beforeRestoreResult =
          await this._restoreByIdStrategy.beforeRestore(mutableId);
        if (beforeRestoreResult !== undefined)
          mutableId = beforeRestoreResult as TId;
      }
    } catch (e) {
      this._logAbortError(RestoreStage.BEFORE_RESTORE, e);
      throw e;
    }

    let restoredEntity: T;

    try {
      restoredEntity = await this._restoreByIdStrategy.restoreByIdMethod(
        mutableId
      );
    } catch (e) {
      this._logAbortError(RestoreStage.RESTORE, e);
      throw e;
    }

    this._logger.info(`${this._alias} entity was successfully restored!`, {
      restoredEntity
    });

    this._callAfterwardsProcedure(restoredEntity);

    return restoredEntity;
  }

  protected _logAbortError(stage: RestoreStage, error: Error) {
    this._logger.info(
      `Restore process of ${this._alias} entity aborted on "${stage}" stage`,
      { stage, error }
    );
  }

  protected async _callAfterwardsProcedure(restoredEntity: T) {
    try {
      if (this._restoreByIdStrategy.afterRestore !== undefined)
        await this._restoreByIdStrategy.afterRestore(restoredEntity);
    } catch (e) {
      this._logger.info(
        `${RestoreStage.AFTER_RESTORE} stage of ${this._alias} entity failed with exception`,
        { stage: RestoreStage.AFTER_RESTORE, error: e }
      );
    }
  }
}
