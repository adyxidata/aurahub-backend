import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ExpertsService } from '../experts/experts.service'; // Импортируем ExpertsService
import { AskQuestionDto } from './dto/ask-question.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly expertsService: ExpertsService, // Внедряем ExpertsService
  ) {}

  async askQuestion(userId: string, askQuestionDto: AskQuestionDto) {
    const { question, expertId } = askQuestionDto;

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Пользователь не найден.');
    }

    // Получаем стоимость эксперта
    const expert = await this.expertsService.findOneById(expertId);
    if (!expert) {
      throw new NotFoundException('Эксперт не найден.');
    }

    const consultationCost = expert.price; // Предполагаем, что у эксперта есть поле 'price'

    // Проверяем баланс пользователя
    if (user.balance < consultationCost) {
      throw new BadRequestException('Недостаточно средств на балансе.');
    }

    // Списываем сумму с баланса пользователя
    await this.usersService.setBalance(userId, user.balance - consultationCost);

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      throw new Error('N8N_WEBHOOK_URL не установлен в .env');
    }

    try {
      const response = await this.httpService
        .post(n8nWebhookUrl, {
          userId,
          expertId,
          question,
        })
        .toPromise();

      const answer = response.data?.answer ?? null;

      await this.prisma.consultation.create({
        data: {
          userId,
          expertId,
          question,
          answer,
        },
      });

      return { answer };
    } catch (error) {
      console.error('Ошибка при отправке вопроса в n8n:', error.message);
      // Если отправка в n8n не удалась, можно рассмотреть откат транзакции (возврат средств)
      // await this.usersService.updateBalance(userId, user.balance + consultationCost);
      throw new BadRequestException('Не удалось отправить вопрос.');
    }
  }

  async getConsultations(userId: string) {
    return this.prisma.consultation.findMany({
      where: { userId },
    });
  }

  async getConsultationById(consultationId: string) {
    return this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });
  }
}