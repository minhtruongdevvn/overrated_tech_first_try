import { IsNotEmpty, IsString } from 'class-validator';

export class Send {
  @IsString()
  @IsNotEmpty()
  message: string;
}
