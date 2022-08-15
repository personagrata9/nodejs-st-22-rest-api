import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUser } from '../interfaces/user.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  findAutoSuggestUsers = async (
    limit: number,
    offset: number,
    loginSubstring: string | undefined,
  ): Promise<IPaginatedItemsResult<IUser>> =>
    this.usersRepository.findAll(limit, offset, loginSubstring);

  findOneById = async (id: string): Promise<IUser> =>
    this.usersRepository.findOneById(id);

  create = async (createUserDto: CreateUserDto): Promise<IUser> =>
    this.usersRepository.create(createUserDto);

  update = async (user: IUser, updateUserDto: UpdateUserDto): Promise<IUser> =>
    this.usersRepository.update(user, updateUserDto);

  delete = async (user: IUser): Promise<void> =>
    this.usersRepository.delete(user);
}
