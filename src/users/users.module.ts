import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module'; // Импортируем PrismaModule

@Module({
  imports: [PrismaModule], // PrismaService должен быть экспортирован из PrismaModule
  providers: [UsersService],
  exports: [UsersService], // Экспортируем UsersService, чтобы его могли использовать другие модули (например, AuthModule)
})
export class UsersModule {}