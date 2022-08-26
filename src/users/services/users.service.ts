import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUser } from '../interfaces/user.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { IPaginatedItemsResult } from '../../common/interfaces/paginated-items-result.interface';

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

  findByLogin = async (login: string): Promise<IUser> =>
    this.usersRepository.findOneByLogin(login);

  create = async (createUserDto: CreateUserDto): Promise<IUser> =>
    this.usersRepository.create(createUserDto);

  update = async (id: string, updateUserDto: UpdateUserDto): Promise<IUser> =>
    this.usersRepository.update(id, updateUserDto);

  delete = async (id: string): Promise<void> => this.usersRepository.delete(id);
}
