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
import { GroupsService } from '../services/groups.service';
import { IGroup } from '../interfaces/group.interface';
import { IPaginatedItemsResult } from 'src/common/interfaces/paginated-items-result.interface';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { AddUsersToGroupDto } from '../dto/add-users-to-group.dto';
import { GroupByIdPipe } from '../pipes/group-by-id.pipe';
import { UsersArrayByIdPipe } from 'src/users/pipes/users-by-id-array.pipe';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('v1/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAll(
    @Query() query: QueryDto,
  ): Promise<IPaginatedItemsResult<IGroup>> {
    const { limit = 10, offset = 0 } = query;

    return this.groupsService.findAll(limit, offset);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
  ): Promise<IGroup> {
    return group;
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<IGroup> {
    return this.groupsService.create(createGroupDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':groupId')
  async addUsersToGroup(
    @Param('groupId', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
    @Body(UsersArrayByIdPipe) addUsersToGroupDto: AddUsersToGroupDto,
  ): Promise<void> {
    const { userIds } = addUsersToGroupDto;

    await this.groupsService.addUsersToGroup(group, userIds);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> {
    return this.groupsService.update(group, updateGroupDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
  ): Promise<void> {
    return this.groupsService.delete(group);
  }
}
