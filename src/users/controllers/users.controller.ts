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
  UseFilters,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { IUser } from '../interfaces/user.interface';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserByIdPipe } from '../validation/pipes/user-by-id.pipe';
import { NotUniqueError } from 'src/common/errors/not-unique.error';
import { ControllerErrorFilter } from 'src/common/filters/controller-error.filter';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseFilters(
    new ControllerErrorFilter(UsersController.name, 'getAutoSuggestUsers'),
  )
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

  @Get(':id')
  @UseFilters(new ControllerErrorFilter(UsersController.name, 'getById'))
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe)
    user: IUser,
  ): Promise<IUser> {
    return user;
  }

  @Post()
  @UseFilters(new ControllerErrorFilter(UsersController.name, 'create'))
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const newUser: IUser = await this.usersService.create(createUserDto);

      return newUser;
    } catch (error) {
      if (error instanceof NotUniqueError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  @UseFilters(new ControllerErrorFilter(UsersController.name, 'update'))
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) user: IUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    try {
      const updatedUser: IUser = await this.usersService.update(
        user,
        updateUserDto,
      );

      return updatedUser;
    } catch (error) {
      if (error instanceof NotUniqueError) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Delete(':id')
  @UseFilters(new ControllerErrorFilter(UsersController.name, 'delete'))
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }), UserByIdPipe) user: IUser,
  ): Promise<void> {
    return this.usersService.delete(user);
  }
}
