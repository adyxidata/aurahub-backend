import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ExpertsModule } from '../experts/experts.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    UsersModule,
    ExpertsModule,
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
})
export class ConsultationsModule {}