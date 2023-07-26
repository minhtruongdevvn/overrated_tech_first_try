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

  @IsString()
  @IsNotEmpty()
  lat: string;

  @IsString()
  @IsNotEmpty()
  lng: string;

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
