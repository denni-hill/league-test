import { LoggerService, LogLevel } from "@nestjs/common";

export abstract class CustomLoggerService implements LoggerService {
  abstract info(message: string, ...optionalParams: any): any;
  abstract log(message: any, ...optionalParams: any[]): any;
  abstract error(message: any, ...optionalParams: any[]): any;
  abstract warn(message: any, ...optionalParams: any[]): any;
  abstract debug?(message: any, ...optionalParams: any[]): any;
  abstract verbose?(message: any, ...optionalParams: any[]): any;
  abstract setLogLevels?(levels: LogLevel[]): any;
}
