import { Injectable } from '@nestjs/common';
import { verify } from './helpers/auth.helpers';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.usersService.findUserByUsernameOrEmail(username);
    const valid_password = await verify(user.password, password);

    if (user && valid_password) {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    }
    return null;
  }
}
