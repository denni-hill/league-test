import { ConsoleLogger, Injectable } from "@nestjs/common";
import winston from "winston";
import { ApplicationConfig } from "../../../config";
import { CustomLoggerService } from "../../types/custom-logger-serivce";
import { consoleTransport, fileTransport } from "./transports";

@Injectable()
export class WinstonLoggerProvider
  extends ConsoleLogger
  implements CustomLoggerService
{
  private _logger: winston.Logger;

  constructor(config: ApplicationConfig, defaultMeta: Record<string, any>) {
    super();
    this._logger = winston.createLogger({
      level: config.environment === "production" ? "info" : "debug",
      defaultMeta: { ...defaultMeta, "service.name": config.name },
      transports: [consoleTransport(), fileTransport()]
    });
  }

  log(message: string, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
  }
  error(message: string, ...optionalParams: any[]) {
    this._logger.error(message, ...optionalParams);
  }
  warn(message: string, ...optionalParams: any[]) {
    this._logger.warn(message, ...optionalParams);
  }
  info(message: string, ...optionalParams: any[]) {
    this._logger.info(message, ...optionalParams);
  }
  debug(message: string, ...optionalParams: any[]) {
    this._logger.debug(message, ...optionalParams);
  }
  verbose(message: string, ...optionalParams: any[]) {
    this._logger.verbose(message, ...optionalParams);
  }
}
