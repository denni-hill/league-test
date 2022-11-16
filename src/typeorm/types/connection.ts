import { DataSource } from "typeorm";

export abstract class Connection {
  abstract get dataSource(): DataSource;
}
