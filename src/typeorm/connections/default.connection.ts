import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DataBaseConfig } from "../../core/config";
import { Connection } from "../types";

@Injectable()
export class DefaultConnection implements Connection {
  constructor(config: DataBaseConfig) {
    this._dataSource = new DataSource({
      type: "postgres",
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.user,
      password: config.password,
      entities: [],
      synchronize: true
    });
  }

  private readonly _dataSource: DataSource;
  public get dataSource() {
    return this._dataSource;
  }
}
