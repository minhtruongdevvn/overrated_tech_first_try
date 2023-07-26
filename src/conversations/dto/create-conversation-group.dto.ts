import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConversationGroupDto {
  @IsNumber()
  creatorId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  background?: string;
}
