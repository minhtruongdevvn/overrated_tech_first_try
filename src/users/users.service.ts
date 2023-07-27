import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Like, Repository } from 'typeorm';
import { UserEvent } from '../common';
import { User as UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly MAX_NEARBY_DISTANCE = 20 * 1000;
  private readonly USER_NEARBY_CACHE_KEY = 'user_nearby';

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getUser(query: UserEvent.Payload.GetUserQuery) {
    const { id, name } = query;
    return this.userRepo.find({
      where: [{ id }, { name: name ? Like(name) : undefined }],
    });
  }

  async getUsersWithinRadius(
    user: UserEntity,
    skip?: number,
    take?: number,
  ): Promise<UserEntity[]> {
    const key = `${this.USER_NEARBY_CACHE_KEY}:${user.id}`;
    const { lng, lat } = user;

    let users = await this.cacheManager.get<UserEntity[]>(key);

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
