import { IsNotEmpty, IsString } from 'class-validator';

export class Send {
  @IsNotEmpty()
  @IsString()
  message: string;
}
