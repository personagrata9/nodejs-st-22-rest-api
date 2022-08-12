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
import { GroupsService } from '../services/groups.service';
import { IGroup } from '../interfaces/group.interface';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { AddUsersToGroupDto } from '../dto/add-users-to-group.dto';
import { GroupByIdPipe } from '../validation/group-by-id.pipe';
import { UsersArrayByIdPipe } from 'src/users/validation/pipes/users-by-id-array.pipe';
import { NotUniqueError } from 'src/common/errors/not-unique.error';
import { ErrorFilter } from 'src/common/filters/error.filter';

@Controller('v1/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @UseFilters(new ErrorFilter(GroupsController.name, 'getAll'))
  async getAll(
    @Query() query: QueryDto,
  ): Promise<IPaginatedItemsResult<IGroup>> {
    const { limit = 10, offset = 0 } = query;

    return this.groupsService.findAll(limit, offset);
  }

  @Get(':id')
  @UseFilters(new ErrorFilter(GroupsController.name, 'getById'))
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
  ): Promise<IGroup> {
    return group;
  }

  @Post()
  @UseFilters(new ErrorFilter(GroupsController.name, 'create'))
  async create(@Body() createGroupDto: CreateGroupDto): Promise<IGroup> {
    try {
      const newGroup: IGroup = await this.groupsService.create(createGroupDto);

      return newGroup;
    } catch (error) {
      if (error instanceof NotUniqueError) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Post(':groupId')
  @UseFilters(new ErrorFilter(GroupsController.name, 'addUsersToGroup'))
  async addUsersToGroup(
    @Param('groupId', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
    @Body(UsersArrayByIdPipe) addUsersToGroupDto: AddUsersToGroupDto,
  ): Promise<void> {
    const { userIds } = addUsersToGroupDto;

    await this.groupsService.addUsersToGroup(group, userIds);
  }

  @Put(':id')
  @UseFilters(new ErrorFilter(GroupsController.name, 'update'))
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> {
    try {
      const updatedGroup: IGroup = await this.groupsService.update(
        group,
        updateGroupDto,
      );

      return updatedGroup;
    } catch (error) {
      if (error instanceof NotUniqueError) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Delete(':id')
  @UseFilters(new ErrorFilter(GroupsController.name, 'delete'))
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
  ): Promise<void> {
    return this.groupsService.delete(group);
  }
}
