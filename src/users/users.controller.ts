import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './models/user.model';
import { UsersService } from './services/users.service';
import { validate as uuidValidate } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private validateUserId = (id: string): void => {
    const isUuid = uuidValidate(id);
    if (!isUuid) {
      throw new HttpException(
        `'${id}' is not a valid UUID`,
        HttpStatus.BAD_REQUEST,
      );
    }
  };

  private throwUserNotFoundExeption = (id: string) => {
    throw new HttpException(
      `User with id '${id}' not found`,
      HttpStatus.NOT_FOUND,
    );
  };

  @Get()
  async getAutoSuggestUsers(@Query() query: any) {
    const { limit = 10, offset = 0, loginSubstring } = query;
    return {
      items: await this.usersService.findAutoSuggestUsers(
        +limit,
        +offset,
        loginSubstring,
      ),
      limit: +limit,
      offset: +offset,
      count: await this.usersService.count(),
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<IUser> {
    this.validateUserId(id);

    try {
      return await this.usersService.findOneById(id);
    } catch {
      this.throwUserNotFoundExeption(id);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    this.validateUserId(id);

    try {
      return await this.usersService.update(id, updateUserDto);
    } catch {
      this.throwUserNotFoundExeption(id);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    this.validateUserId(id);

    try {
      return await this.usersService.delete(id);
    } catch {
      this.throwUserNotFoundExeption(id);
    }
  }
}
