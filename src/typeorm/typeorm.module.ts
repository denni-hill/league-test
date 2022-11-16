import { Module } from "@nestjs/common";
import { CategoryRepository } from "../category/types";
import { CustomConfigModule, DataBaseConfig } from "../core/config";
import { CustomLoggerModule } from "../core/custom-logger";
import { DefaultConnection } from "./connections";
import { TypeormCategoryRepository } from "./repositories";
import { Connection } from "./types";
import { IntegerIdValidation } from "./validations";
import { UUIDValidation } from "./validations/uuid.validation";

@Module({
  imports: [CustomConfigModule, CustomLoggerModule],
  providers: [
    UUIDValidation,
    IntegerIdValidation,
    {
      provide: Connection,
      useFactory: async function (config: DataBaseConfig) {
        const connection = new DefaultConnection(config);
        await connection.dataSource.initialize();
        return connection;
      },
      inject: [DataBaseConfig]
    },
    {
      provide: CategoryRepository,
      useClass: TypeormCategoryRepository
    }
  ],
  exports: [CategoryRepository, UUIDValidation]
})
export class TypeormModule {}
