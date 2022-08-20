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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { IUser } from '../interfaces/user.interface';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAutoSuggestUsers(
    @Query() query: QueryDto,
  ): Promise<IPaginatedItemsResult<IUser>> {
    const { limit = 10, offset = 0, loginSubstring } = query;

    return this.usersService.findAutoSuggestUsers(
      limit,
      offset,
      loginSubstring,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe)
    user: IUser,
  ): Promise<IUser> {
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) user: IUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.usersService.update(user.id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) user: IUser,
  ): Promise<void> {
    return this.usersService.delete(user.id);
  }
}
