import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentsModule } from './payments/payments.module';
import { ExpertsModule } from './experts/experts.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { ConfigModule } from '@nestjs/config'; // Импортируем ConfigModule
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Делаем ConfigModule глобальным
    AuthModule,
    UsersModule,
    PrismaModule,
    PaymentsModule,
    ExpertsModule,
    ConsultationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
