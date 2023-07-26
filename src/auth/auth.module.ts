import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllConfigType, SecurityConfig } from 'src/configs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Oauth } from './entities/oauth.entity';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { OauthService } from './oauth.service';
import { PasswordService } from './password.service';
import { JWTStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Oauth, User]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<AllConfigType>) => {
        const securityConfig =
          configService.getOrThrow<SecurityConfig>('security');
        return {
          secret: securityConfig.atSecret,
          signOptions: {
            expiresIn: securityConfig.atExpiration,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTStrategy,
    AuthGuard,
    PasswordService,
    OauthService,
  ],
  exports: [OauthService],
})
export class AuthModule {}
