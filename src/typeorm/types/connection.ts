import { OnApplicationShutdown } from "@nestjs/common";
import { DataSource } from "typeorm";

export abstract class Connection implements OnApplicationShutdown {
  abstract onApplicationShutdown(signal?: string): void;
  abstract get dataSource(): DataSource;
}
