import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делаем PrismaModule глобальным, чтобы не импортировать его в каждый модуль
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}