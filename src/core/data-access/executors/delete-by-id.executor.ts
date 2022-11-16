import { CustomLoggerService } from "../../custom-logger";
import { DeleteByIdStrategy, DeleteStage } from "../types";

export class DeleteByIdExecutor<T, TId = number> {
  constructor(
    private readonly _logger: CustomLoggerService,
    private readonly _alias: string,
    private readonly _deleteByIdStrategy: DeleteByIdStrategy<T, TId>
  ) {}

  async deleteById(id: TId): Promise<T> {
    let mutableId: TId = id;

    try {
      if (this._deleteByIdStrategy.beforeDelete !== undefined) {
        const beforeDeleteResult = await this._deleteByIdStrategy.beforeDelete(
          mutableId
        );
        if (beforeDeleteResult !== undefined)
          mutableId = beforeDeleteResult as TId;
      }
    } catch (e) {
      this._logAbortError(DeleteStage.BEFORE_DELETE, e);
      throw e;
    }

    let deletedEntity: T;
    try {
      deletedEntity = await this._deleteByIdStrategy.deleteByIdMethod(
        mutableId
      );
    } catch (e) {
      this._logAbortError(DeleteStage.DELETE, e);
      throw e;
    }

    this._logger.info(`${this._alias} was successfully deleted!`, {
      deletedEntity
    });

    this._callAfterwardsProcedure(deletedEntity);

    return deletedEntity;
  }

  protected _logAbortError(stage: DeleteStage, error: Error) {
    this._logger.info(
      `Delete process of ${this._alias} entity aborted on "${stage}" stage`,
      { stage, error }
    );
  }

  protected async _callAfterwardsProcedure(deletedEntity: T) {
    try {
      if (this._deleteByIdStrategy.afterDelete !== undefined)
        await this._deleteByIdStrategy.afterDelete(deletedEntity);
    } catch (e) {
      this._logger.info(
        `${DeleteStage.AFTER_DELETE} stage of ${this._alias} entity failed with exception`,
        { stage: DeleteStage.AFTER_DELETE, error: e }
      );
    }
  }
}
