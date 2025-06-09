import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Предполагаем, что у вас есть PrismaService
import { PaymentStatus } from '@prisma/client'; // Импортируем enum из сгенерированного клиента
import { UsersService } from '../users/users.service'; // Предполагаем, что у вас есть UsersService

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService, // Инжектим UsersService для обновления баланса
  ) {}

  async createTopup(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    // Создаем запись о платеже в статусе PENDING
    const payment = await this.prisma.payment.create({
      data: {
        userId: userId,
        amount: amount,
        status: PaymentStatus.PENDING,
      },
    });

    // В реальной интеграции здесь был бы вызов API платежной системы
    // и получение реальной ссылки на оплату.
    // Сейчас просто генерируем фейковую ссылку для демонстрации.
    const fakePaymentLink = `https://fake-payment-gateway.com/pay?id=${payment.id}&amount=${amount}`;

    return {
      paymentId: payment.id,
      amount: payment.amount,
      paymentLink: fakePaymentLink,
    };
  }

  async processWebhook(paymentId: string, status: 'SUCCESS' | 'FAILED') {
    // Находим платеж по ID
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true }, // Включаем пользователя, чтобы обновить баланс
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID "${paymentId}" not found`);
    }

    // Если статус уже конечный (SUCCESS или FAILED), ничего не делаем
    if (payment.status !== PaymentStatus.PENDING) {
      console.warn(`Webhook received for payment ${paymentId} with status ${status}, but payment is already ${payment.status}. Skipping.`);
      return { success: false, message: 'Payment already processed' };
    }

    // Обновляем статус платежа
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus[status] }, // Используем enum из Prisma Client
    });

    // Если статус SUCCESS, увеличиваем баланс пользователя
    if (status === 'SUCCESS') {
      // Используем транзакцию для атомарности: обновление платежа И обновление баланса
      try {
         await this.prisma.$transaction(async (tx) => {
            // Обновляем статус платежа (повторно в транзакции, чтобы быть уверенным)
            await tx.payment.update({
               where: { id: paymentId },
               data: { status: PaymentStatus.SUCCESS },
            });

            // Увеличиваем баланс пользователя
            await tx.user.update({
               where: { id: payment.userId },
               data: { balance: { increment: payment.amount } },
            });
         });
         console.log(`Payment ${paymentId} successful. User ${payment.userId} balance increased by ${payment.amount}.`);
         return { success: true, message: 'Payment processed successfully and balance updated' };

      } catch (error) {
         console.error(`Error processing payment ${paymentId} transaction:`, error);
         // В случае ошибки транзакция откатится, статус платежа останется PENDING (или FAILED, если это было первое обновление)
         // и баланс не изменится. Возможно, потребуется ручное вмешательство или система ретраев для вебхуков.
         throw new InternalServerErrorException('Failed to process payment transaction'); // InternalServerErrorException из @nestjs/common
      }
    } else { // status === 'FAILED'
       console.log(`Payment ${paymentId} failed.`);
       return { success: true, message: 'Payment status updated to FAILED' };
    }
  }
}