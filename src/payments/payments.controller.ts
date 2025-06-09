import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class TopupDto {
  amount: number;
}

class WebhookDto {
  paymentId: string;
  status: 'SUCCESS' | 'FAILED';
}

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('topup')
  async topup(@Req() req, @Body() dto: TopupDto) {
    return this.paymentsService.createTopup(req.user.id, dto.amount);
  }

  @Post('webhook/payment')
  async webhook(@Body() dto: WebhookDto) {
    return this.paymentsService.processWebhook(dto.paymentId, dto.status);
  }
}
