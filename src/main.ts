import { NestApplication, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ApplicationConfig } from "./core/config";
import { CustomLoggerService } from "./core/custom-logger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true }
  );
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);

  const applicationConfig = app.get(ApplicationConfig);

  const config = new DocumentBuilder()
    .setTitle(applicationConfig.name)
    .setDescription(`${applicationConfig.description}`)
    .setVersion(applicationConfig.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(applicationConfig.port, applicationConfig.ip);
  logger.log(
    `HTTP server started on ${applicationConfig.ip}:${applicationConfig.port}`,
    NestApplication.name
  );
}
bootstrap();
