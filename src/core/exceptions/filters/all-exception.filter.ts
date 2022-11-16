import {
  ArgumentsHost,
  Catch,
  HttpException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost } from "@nestjs/core";
import { CustomLoggerService } from "../../custom-logger";

@Catch()
@Injectable()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly _logger: CustomLoggerService,
    httpAdapterHost: HttpAdapterHost
  ) {
    super(httpAdapterHost.httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      if (exception instanceof InternalServerErrorException) {
        this._logger.error(exception.message, {
          cause: exception.cause,
          response: exception.getResponse()
        });
      } else
        this._logger.info(exception.message, {
          cause: exception.cause,
          response: exception.getResponse()
        });
    } else {
      console.log(exception);
      this._logger.error("Internal Server Error", exception);
    }

    super.catch(exception, host);
  }
}
