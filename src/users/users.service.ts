import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.findOneById(id);
  }

  async create(email: string, passwordHash: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
  }

  async updateBalance(userId: string, amount: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    });
  }

  async setBalance(userId: string, newBalance: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
  }
}