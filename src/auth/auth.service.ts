import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientException } from 'src/common/exception';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Oauth } from './entities/oauth.entity';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Oauth) private readonly oauthRepo: Repository<Oauth>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ClientException('NOT_FOUND', 'user not found');

    const isValidPassword = await this.passwordService.validatePassword(
      dto.password,
      user.password,
    );
    if (!isValidPassword) throw new UnauthorizedException();

    const accessToken = this.generateToken(user.id);
    await this.oauthRepo.upsert(
      { userId: user.id, accessToken },
      { conflictPaths: { user: true } },
    );

    return {
      accessToken,
      user,
    };
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );

    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    await user.save();

    return user;
  }

  private generateToken(userId: number) {
    return this.jwtService.sign({
      sub: userId,
    });
  }
}
