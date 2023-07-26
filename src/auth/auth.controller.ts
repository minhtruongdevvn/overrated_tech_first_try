import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  public register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}