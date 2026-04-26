import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message || exception.message
          : exception.message;
      error = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(exception);
    }

    this.logger.debug(`URL: ${request.url}, Error: ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      error:
        typeof error === 'object' ? error : { detail: error?.toString() },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
