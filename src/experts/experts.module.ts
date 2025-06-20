import { Module } from '@nestjs/common';
import { ExpertsController } from './experts.controller';
import { ExpertsService } from './experts.service';

@Module({
  controllers: [ExpertsController],
  providers: [ExpertsService],
  exports: [ExpertsService],
})
export class ExpertsModule {}
