import {
  BadRequestException,
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
import { UsersService } from './services/users.service';
import { User } from './interfaces/user.interface';
import { PaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserByIdPipe } from './validation/pipes/user-by-id.pipe';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAutoSuggestUsers(
    @Query() query: any,
  ): Promise<PaginatedItemsResult<User>> {
    const { limit = 10, offset = 0, loginSubstring } = query;

    return this.usersService.findAutoSuggestUsers(
      +limit,
      +offset,
      loginSubstring,
    );
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser: User = await this.usersService.create(createUserDto);

      return newUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const updatedUser: User = await this.usersService.update(
        id,
        updateUserDto,
      );

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
  ): Promise<void> {
    return this.usersService.delete(id);
  }
}
