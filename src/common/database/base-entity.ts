import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity as TypeORMBaseEntity,
} from 'typeorm';

export class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: number;
}
