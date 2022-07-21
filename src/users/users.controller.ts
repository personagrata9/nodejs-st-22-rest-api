import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { UserByIdPipe } from './validation/pipes/user-by-id.pipe';

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
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
  ): Promise<IUser> {
    return await this.usersService.findOneById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
  ) {
    return await this.usersService.delete(id);
  }
}
