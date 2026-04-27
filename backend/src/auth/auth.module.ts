import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { CsrfService } from '../common/guards/csrf.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: (process.env.JWT_EXPIRY || '15m') as any },
    }),
  ],
  providers: [AuthService, CsrfService, PrismaService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
