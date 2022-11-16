import { DataSource } from "typeorm";

export interface Connection {
  get dataSource(): DataSource;
}
