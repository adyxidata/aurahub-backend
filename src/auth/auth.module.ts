import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Импортируем UsersModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Для ConfigService

@Module({
  imports: [
    UsersModule, // UsersService должен быть экспортирован из UsersModule
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Импортируем ConfigModule для использования ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Время жизни токена
      }),
      inject: [ConfigService],
    }),
    ConfigModule, // Добавляем ConfigModule сюда, если он еще не глобальный
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Экспортируем AuthService, если он понадобится в других модулях
})
export class AuthModule {}