import { BaseEntity } from 'src/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @Column({ length: 150 })
  name: string;

  @Column('text')
  street: string;

  @Column('double precision')
  lat: number;

  @Column('double precision')
  lng: number;

  @Column('int')
  countryId: number;

  @Column('int')
  districtId: number;

  @Column('int')
  wandId: number;

  @Column({ length: 30 })
  phone: string;

  /** true is female, false is male */
  @Column()
  gender: boolean;

  @Column('text')
  birthday: string;
}
