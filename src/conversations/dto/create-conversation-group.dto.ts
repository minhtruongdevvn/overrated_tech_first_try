import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationGroupDto {
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
