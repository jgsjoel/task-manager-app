import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const validationErrors: { field: string; message: string }[] = [];

    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      Array.isArray(exceptionResponse.message)
    ) {
      validationErrors.push(
        ...exceptionResponse.message.map((error: any) => ({
          field: error.property,
          message: Object.values(error.constraints || {}).join(', '),
        })),
      );
    }

    response.status(status).json({
      statusCode: status,
      message: 'Validation failed',
      errors: validationErrors.length > 0 ? validationErrors : exceptionResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
