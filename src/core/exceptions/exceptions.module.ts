import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { CustomLoggerModule } from "../custom-logger";
import { AllExceptionsFilter } from "./filters";

@Module({
  imports: [CustomLoggerModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class ExceptionsModule {}
