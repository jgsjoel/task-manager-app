import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter.js';
import helmet from 'helmet';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    });
    const isProd = process.env.NODE_ENV === 'production';
    const allowedConnectSrc = process.env.CORS_ORIGIN?.split(',') ?? [];
    app.use(helmet({
        contentSecurityPolicy: {
            directives: isProd
                ? {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'"],
                    styleSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", ...allowedConnectSrc],
                    objectSrc: ["'none'"],
                    baseUri: ["'self'"],
                    frameAncestors: ["'none'"],
                    formAction: ["'self'"],
                    upgradeInsecureRequests: [],
                }
                : {
                    defaultSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    baseUri: ["'self'"],
                    frameAncestors: ["'none'"],
                    formAction: ["'self'"],
                },
        },
    }));
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalFilters(new ValidationExceptionFilter());
    await app.listen(process.env.API_PORT ?? 3000, process.env.API_HOST ?? 'localhost');
    console.log(`✓ Application running on http://${process.env.API_HOST ?? 'localhost'}:${process.env.API_PORT ?? 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map