import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class AskQuestionDto {
  @IsUUID()
  expertId: string;

  @IsString()
  @IsNotEmpty()
  question: string;
}