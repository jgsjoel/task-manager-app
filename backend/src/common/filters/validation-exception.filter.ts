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

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const messages = exceptionResponse.message;

      // Handle if message is a string
      if (typeof messages === 'string') {
        response.status(status).json({
          statusCode: status,
          message: messages,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Handle if message is an array of validation errors
      if (Array.isArray(messages)) {
        messages.forEach((error: any) => {
          if (error.property && error.constraints) {
            // Standard ValidationError from class-validator
            validationErrors.push({
              field: error.property,
              message: Object.values(error.constraints).join(', '),
            });
          } else if (typeof error === 'string') {
            // String error message
            validationErrors.push({
              field: 'general',
              message: error,
            });
          }
        });
      }
    }

    response.status(status).json({
      statusCode: status,
      message: 'Validation failed',
      errors: validationErrors.length > 0 ? validationErrors : exceptionResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
