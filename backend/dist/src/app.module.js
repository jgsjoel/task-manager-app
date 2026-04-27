var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module.js';
import { TaskModule } from './task/task.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CsrfMiddleware } from './common/guards/csrf.middleware.js';
import { CsrfService } from './common/guards/csrf.service.js';
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(CsrfMiddleware)
            .forRoutes('auth/refresh', 'auth/logout');
    }
};
AppModule = __decorate([
    Module({
        imports: [
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map