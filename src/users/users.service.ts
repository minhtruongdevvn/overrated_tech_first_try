import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly MAX_NEARBY_DISTANCE = 20 * 1000;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getUsersWithinRadius(
    user: User,
    skip?: number,
    take?: number,
  ): Promise<User[]> {
    const { lng, lat } = user;

    return await this.userRepo
      .createQueryBuilder('user')
      .where(
        `st_distancesphere(ST_MakePoint(user.lng, user.lat), ST_MakePoint(:lng, :lat)) <= :radius`,
        { lng, lat, radius: this.MAX_NEARBY_DISTANCE },
      )
      .skip(skip)
      .take(take)
      .getMany();
  }
}
