import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { TaskModule } from './task/task.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule, TaskModule],
  providers: [],
})
export class AppModule {}
