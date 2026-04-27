import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module.js';
import { TaskModule } from './task/task.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CsrfMiddleware } from './common/guards/csrf.middleware.js';
import { CsrfService } from './common/guards/csrf.service.js';

@Module({
  imports: [
    // Rate limiting: 5 requests per 15 seconds
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15000'),
        limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
      },
    ]),
    PrismaModule,
    AuthModule,
    TaskModule,
  ],
  providers: [
    CsrfService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // CSRF required for cookie-dependent state-changing auth routes
    consumer
      .apply(CsrfMiddleware)
      .forRoutes('auth/refresh', 'auth/logout');
  }
}
