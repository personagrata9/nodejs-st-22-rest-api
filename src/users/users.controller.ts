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
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './services/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserByIdPipe } from './validation/pipes/user-by-id.pipe';
import { PaginatedItemsResult } from 'src/interfaces/paginated-items-result.interface';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAutoSuggestUsers(
    @Query() query: any,
  ): Promise<PaginatedItemsResult<IUser>> {
    const { limit = 10, offset = 0, loginSubstring } = query;
    return await this.usersService.findAutoSuggestUsers(
      +limit,
      +offset,
      loginSubstring,
    );
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
  ): Promise<IUser> {
    return await this.usersService.findOneById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) id: string,
  ) {
    return await this.usersService.delete(id);
  }
}
