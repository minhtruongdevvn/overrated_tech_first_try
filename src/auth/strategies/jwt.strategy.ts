import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AllConfigType, SecurityConfig } from 'src/configs';
import { Repository } from 'typeorm';
import { Oauth } from '../entities/oauth.entity';
import { JWTPayload } from '../types/jwt-payload.type';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<AllConfigType>,
    @InjectRepository(Oauth)
    private readonly oauthRepo: Repository<Oauth>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.getOrThrow<SecurityConfig>('security').atSecret,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  //todo: implement
  async validate(req: Request, payload: JWTPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) throw new UnauthorizedException();

    if (!payload?.sub) throw new UnauthorizedException();

    this.oauthRepo.findOne({
      where: { id: payload.sub },
      relations: { user: true },
    });
    return { userId: payload.sub };
  }
}
