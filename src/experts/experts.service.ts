import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Предполагаем, что у вас есть PrismaService

@Injectable()
export class ExpertsService {
  constructor(private prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.expert.findMany({
      where: { active: true },
    });
  }

  async findOneBySlug(slug: string) {
    return this.prisma.expert.findUnique({
      where: { slug },
    });
  }

  async findOneById(id: string) {
     return this.prisma.expert.findUnique({
       where: { id },
     });
   }
}
