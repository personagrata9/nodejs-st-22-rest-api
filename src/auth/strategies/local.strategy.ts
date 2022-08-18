import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/services/users.service';
import { IUser } from 'src/users/interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string): Promise<IUser> {
    const user: IUser = await this.usersService.findByLogin(username);

    if (user) {
      if (user.isDeleted) {
        throw new NotFoundException(`user with login ${username} is deleted`);
      }
    } else {
      throw new NotFoundException(`user with login ${username} doesn't exist`);
    }

    const isPasswordMatches: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordMatches)
      throw new BadRequestException('Password is incorrect');

    return user;
  }
}
