import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oauth } from './entities/oauth.entity';

export class OauthService {
  constructor(
    @InjectRepository(Oauth) private readonly oauthService: Repository<Oauth>,
  ) {}

  getByToken(token: string) {
    return this.oauthService.findOne({
      where: { accessToken: token },
      relations: { user: true },
    });
  }
}
