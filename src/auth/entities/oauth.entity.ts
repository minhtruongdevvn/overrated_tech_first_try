import { BaseEntity } from 'src/common';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';

@Entity()
export class Oauth extends BaseEntity {
  @Column('bigint')
  @RelationId((e: Oauth) => e.user)
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text', { nullable: true })
  accessToken?: string | null;

  @Column('int', { nullable: true })
  status: number;
}
