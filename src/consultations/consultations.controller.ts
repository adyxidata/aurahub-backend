import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async askQuestion(@Req() req, @Body() askQuestionDto: AskQuestionDto) {
    return this.consultationsService.askQuestion(req.user.userId, askQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConsultations(@Req() req) {
    return this.consultationsService.getConsultations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getConsultationById(@Param('id') id: string) {
    return this.consultationsService.getConsultationById(id);
  }
}
