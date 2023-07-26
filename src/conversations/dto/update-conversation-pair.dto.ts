import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateConversationPairDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  background?: string;
}
