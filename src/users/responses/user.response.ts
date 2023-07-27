import { Exclude } from 'class-transformer';

export class UserResponse {
  @Exclude()
  password: string;
}
