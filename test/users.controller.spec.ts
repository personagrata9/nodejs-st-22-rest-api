import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users/controllers/users.controller';
import { UsersService } from '../src/users/services/users.service';
import { UsersServiceMock } from './__mocks__/users.service.mock';
import { IUser } from '../src/users/interfaces/user.interface';
import { IPaginatedItemsResult } from '../src/common/interfaces/paginated-items-result.interface';
import { user } from './fixtures/user.fixture';
import { createUserDto } from './fixtures/create-user-dto.fixture';
import { updateUserDto } from './fixtures/update-user-dto.fixture';
import { NotUniqueError } from '../src/common/errors/not-unique.error';
import { BadRequestException } from '@nestjs/common';
import { hashPassword } from '../src/common/utils/hash-password';

describe('UsersController', () => {
  let controller: UsersController;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: UsersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return array of users with login includes loginSubstring', async () => {
    const loginSubstring: string = user.login.substring(0, 3);
    const limit = 10;
    const offset = 0;

    service.findAutoSuggestUsers.mockResolvedValue({
      items: [user],
      limit,
      offset,
      count: 1,
    });

    const result: IPaginatedItemsResult<IUser> =
      await controller.getAutoSuggestUsers({ limit, offset, loginSubstring });

    expect(result).toEqual({ items: [user], limit, offset, count: 1 });
    expect(service.findAutoSuggestUsers.mock.calls[0]).toMatchSnapshot();
  });

  it('should return user', async () => {
    service.findOneById.mockResolvedValue(user);

    const result: IUser = await controller.getById(user);

    expect(result).toEqual(user);
  });

  it('should create a user', async () => {
    service.create.mockResolvedValue(user);

    const result: IUser = await controller.create(createUserDto);

    expect(result).toEqual(user);
  });

  it('should throw an error when creating a user with not unique login', async () => {
    service.create.mockRejectedValue(
      new NotUniqueError('user', 'login', createUserDto.login),
    );

    try {
      await controller.create(createUserDto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        `user with login ${createUserDto.login} already exists, please choose another login`,
      );
    }
  });

  it('should update existing user', async () => {
    const password: string = await hashPassword(updateUserDto.password);
    const updatedUser: IUser = { ...user, ...updateUserDto, password };

    service.update.mockResolvedValue(updatedUser);

    const result: IUser = await controller.update(user, updateUserDto);

    expect(result).toEqual(updatedUser);
  });

  it('should throw an error when updating a user with not unique login', async () => {
    service.update.mockRejectedValue(
      new NotUniqueError('user', 'login', updateUserDto.login),
    );

    try {
      await controller.update(user, updateUserDto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        `user with login ${updateUserDto.login} already exists, please choose another login`,
      );
    }
  });

  it('should delete existing user', async () => {
    const result = await controller.delete(user);
    expect(result).toBeUndefined();
  });
});
