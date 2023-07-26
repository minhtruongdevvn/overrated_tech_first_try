import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  conversationId: number;

  @IsNumber()
  userId: number;
}
