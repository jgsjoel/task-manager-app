import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CsrfService } from './csrf.service.js';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private csrfService: CsrfService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const cookieSecret = req.cookies?.csrfSecret;

      if (!cookieSecret) {
        throw new BadRequestException('CSRF cookie missing');
      }

      const token = req.get('X-CSRF-Token');

      if (!token) {
        throw new BadRequestException('CSRF token is required');
      }

      if (!this.csrfService.validateToken(cookieSecret, token)) {
        throw new BadRequestException('Invalid CSRF token');
      }
    }

    next();
  }
}
