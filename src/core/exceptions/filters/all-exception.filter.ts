import {
  ArgumentsHost,
  Catch,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost } from "@nestjs/core";
import { CustomLoggerService } from "../../custom-logger";
import {
  BaseError,
  ConflictError,
  NotFoundError,
  ValidationError
} from "../../errors";

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
    if (exception instanceof BaseError) {
      if (exception instanceof ConflictError)
        exception = new ConflictException(exception.message);
      else if (exception instanceof NotFoundError)
        exception = new NotFoundException(exception.message);
      else if (exception instanceof ValidationError)
        exception = new UnprocessableEntityException({
          message: exception.message,
          error: exception.cause
        });
    }

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
