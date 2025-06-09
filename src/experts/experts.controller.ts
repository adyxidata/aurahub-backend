import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ExpertsService } from './experts.service';

@Controller('api/experts')
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Get()
  findAllActive() {
    return this.expertsService.findAllActive();
  }

  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string) {
    const expert = await this.expertsService.findOneBySlug(slug);
    if (!expert) {
      throw new NotFoundException(`Expert with slug "${slug}" not found`);
    }
    return expert;
  }
}
