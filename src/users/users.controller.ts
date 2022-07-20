import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './models/user.model';
import { UsersService } from './services/users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<IUser> {
    try {
      return await this.usersService.findOneById(id);
    } catch {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.usersService.delete(id);
    } catch {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
  }
}
