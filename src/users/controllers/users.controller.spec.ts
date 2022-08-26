import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { IUser } from '../interfaces/user.interface';
import { InMemoryUsersRepository } from '../repository/in-memory-users.repository';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { comparePassword } from '../../common/utils/compare-password';
import { IPaginatedItemsResult } from '../../common/interfaces/paginated-items-result.interface';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const createUserData: CreateUserDto = {
    login: 'user1',
    password: 'user1',
    age: 10,
  };

  const updateUserData: UpdateUserDto = {
    login: 'user1_upd',
    password: 'user1',
    age: 11,
  };

  let mockUser: IUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'UsersRepository',
          useClass: InMemoryUsersRepository,
        },
        {
          provide: AccessTokenGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return no users', async () => {
    const users: IPaginatedItemsResult<IUser> =
      await controller.getAutoSuggestUsers({});

    expect(users.items.length).toEqual(0);
  });

  it('should create a user', async () => {
    const savedUser: IUser = await controller.create(createUserData);
    const isPasswordMatches: boolean = await comparePassword(
      createUserData.password,
      savedUser.password,
    );

    mockUser = savedUser;

    expect(isPasswordMatches).toBe(true);

    expect(savedUser).toEqual({
      id: expect.any(String),
      ...createUserData,
      password: expect.any(String),
      isDeleted: false,
    });
  });

  it('should throw an error when creating a user with not unique login', async () => {
    try {
      await controller.create(createUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        `user with login ${createUserData.login} already exists, please choose another login`,
      );
    }
  });

  it('should return array with one user', async () => {
    const users: IPaginatedItemsResult<IUser> =
      await controller.getAutoSuggestUsers({});

    expect(users.items.length).toEqual(1);

    expect(users.items[0]).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const updatedUser: IUser = await controller.update(
      mockUser,
      updateUserData,
    );
    const isPasswordMatches: boolean = await comparePassword(
      updateUserData.password,
      mockUser.password,
    );

    mockUser = updatedUser;

    expect(isPasswordMatches).toBe(true);

    expect(updatedUser).toEqual({
      id: expect.any(String),
      ...updateUserData,
      password: expect.any(String),
      isDeleted: false,
    });
  });

  it('should delete a user', async () => {
    const result = await controller.delete(mockUser);
    expect(result).toBeUndefined();

    const users: IPaginatedItemsResult<IUser> =
      await controller.getAutoSuggestUsers({});
    expect(users.items.length).toEqual(0);
  });
});
