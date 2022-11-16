import { Module } from "@nestjs/common";
import { ApplicationConfig, CustomConfigModule } from "../config";
import { WinstonLoggerProvider } from "./providers";
import { CustomLoggerService } from "./types";

@Module({
  imports: [CustomConfigModule],
  providers: [
    {
      provide: CustomLoggerService,
      useFactory: (config: ApplicationConfig) => {
        return new WinstonLoggerProvider(config, {});
      },
      inject: [ApplicationConfig]
    }
  ],
  exports: [CustomLoggerService]
})
export class CustomLoggerModule {}
