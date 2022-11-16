import { Module } from "@nestjs/common";
import { CustomLoggerModule } from "../custom-logger";
import { AllExceptionsFilter } from "./filters";

@Module({
  imports: [CustomLoggerModule],
  providers: [AllExceptionsFilter],
  exports: [AllExceptionsFilter]
})
export class ExceptionsModule {}
