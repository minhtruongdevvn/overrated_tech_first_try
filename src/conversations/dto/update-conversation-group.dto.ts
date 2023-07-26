import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateConversationGroupDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  background?: string;
}
