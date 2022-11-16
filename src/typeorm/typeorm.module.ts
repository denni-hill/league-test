import { Module } from "@nestjs/common";
import { CustomConfigModule, DataBaseConfig } from "../core/config";
import { CustomLoggerModule } from "../core/custom-logger";
import { DefaultConnection } from "./connections";

@Module({
  imports: [CustomConfigModule, CustomLoggerModule],
  providers: [
    {
      provide: DefaultConnection,
      useFactory: async function (config: DataBaseConfig) {
        const connection = new DefaultConnection(config);
        await connection.dataSource.initialize();
        return connection;
      },
      inject: [DataBaseConfig]
    }
  ],
  exports: []
})
export class TypeormModule {}
