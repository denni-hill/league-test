import path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ApplicationConfigProvider, DataBaseConfigProvider } from "./providers";
import { ApplicationConfig, DataBaseConfig } from "./configs";

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [path.join(process.cwd(), ".env")]
    })
  ],
  providers: [
    {
      provide: ApplicationConfig,
      useClass: ApplicationConfigProvider
    },
    {
      provide: DataBaseConfig,
      useClass: DataBaseConfigProvider
    }
  ],
  exports: [ApplicationConfig, DataBaseConfig]
})
export class CustomConfigModule {}
