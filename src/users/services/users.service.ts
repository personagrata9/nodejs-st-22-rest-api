import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../interfaces/user.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { PaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  findAutoSuggestUsers = async (
    limit: number,
    offset: number,
    loginSubstring: string | undefined,
  ): Promise<PaginatedItemsResult<User>> =>
    this.usersRepository.findAll(limit, offset, loginSubstring);

  findOneById = async (id: string): Promise<User> =>
    this.usersRepository.findOneById(id);

  create = async (createUserDto: CreateUserDto): Promise<User> =>
    this.usersRepository.create(createUserDto);

  update = async (id: string, updateUserDto: UpdateUserDto): Promise<User> =>
    this.usersRepository.update(id, updateUserDto);

  delete = async (id: string): Promise<void> => this.usersRepository.delete(id);
}
