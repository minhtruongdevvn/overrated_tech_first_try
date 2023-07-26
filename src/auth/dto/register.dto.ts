import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsNumber()
  countryId: number;

  @IsNumber()
  districtId: number;

  @IsNumber()
  wandId: number;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsBoolean()
  gender: boolean;

  @IsString()
  @IsNotEmpty()
  birthday: string;
}
