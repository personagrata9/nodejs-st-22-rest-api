import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './models/user.model';
import { UsersService } from './services/users.service';
import { validate as uuidValidate } from 'uuid';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAutoSuggestUsers(@Query() query: any) {
    const { limit = 10, offset = 0, loginSubstring } = query;
    return {
      items: await this.usersService.findAutoSuggestUsers(
        limit,
        offset,
        loginSubstring,
      ),
      limit,
      offset,
      count: await this.usersService.count(),
    };
  }

  @Get(':id')
  async getById(@Param() params): Promise<IUser> {
    const { id } = params;
    const isUuid = uuidValidate(id);
    if (!isUuid) {
      throw new HttpException(
        `'${id}' is not a valid UUID`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.usersService.findOneById(id);
    } catch {
      throw new HttpException(
        `User with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.usersService.create(createUserDto);
  }
}
