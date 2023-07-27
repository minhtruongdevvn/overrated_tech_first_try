import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly MAX_NEARBY_DISTANCE = 20 * 1000;
  private readonly USER_NEARBY_CACHE_KEY = 'user_nearby';

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getUsersWithinRadius(
    user: User,
    skip?: number,
    take?: number,
  ): Promise<User[]> {
    const key = `${this.USER_NEARBY_CACHE_KEY}:${user.id}`;
    const { lng, lat } = user;

    let users = await this.cacheManager.get<User[]>(key);

    if (!users) {
      users = await this.userRepo
        .createQueryBuilder('user')
        .where(
          `st_distancesphere(ST_MakePoint(user.lng, user.lat), ST_MakePoint(:lng, :lat)) <= :radius`,
          { lng, lat, radius: this.MAX_NEARBY_DISTANCE },
        )
        .andWhere('user.id != :userId', { userId: user.id })
        .skip(skip)
        .take(take)
        .getMany();

      await this.cacheManager.set(key, users);
    }

    return users;
  }
}
