import { Module } from "@nestjs/common";
import { ExceptionsModule } from "./core/exceptions/exceptions.module";
import { TypeormModule } from "./typeorm/typeorm.module";
import { CustomConfigModule } from "./core/config";
import { CustomLoggerModule } from "./core/custom-logger";
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    CustomConfigModule,
    CustomLoggerModule,
    ExceptionsModule,
    TypeormModule,
    CategoryModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
