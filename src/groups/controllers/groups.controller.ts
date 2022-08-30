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
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from '../services/groups.service';
import { IGroup } from '../interfaces/group.interface';
import { IPaginatedItemsResult } from '../../common/interfaces/paginated-items-result.interface';
import { QueryDto } from '../../common/dto/query.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { AddUsersToGroupDto } from '../dto/add-users-to-group.dto';
import { GroupByIdPipe } from '../pipes/group-by-id.pipe';
import { UsersArrayByIdPipe } from '../../users/pipes/users-by-id-array.pipe';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { NotUniqueError } from '../../common/errors/not-unique.error';
import { ISuccessResponse } from 'src/common/interfaces/success-response.interface';

@UseGuards(AccessTokenGuard)
@Controller('v1/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getAll(
    @Query() query: QueryDto,
  ): Promise<IPaginatedItemsResult<IGroup>> {
    const { limit = 10, offset = 0 } = query;

    return this.groupsService.findAll(limit, offset);
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
  ): Promise<IGroup> {
    return group;
  }

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<IGroup> {
    try {
      const newGroup: IGroup = await this.groupsService.create(createGroupDto);
      return newGroup;
    } catch (error) {
      if (error instanceof NotUniqueError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Post(':groupId')
  async addUsersToGroup(
    @Param('groupId', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
    @Body(UsersArrayByIdPipe) addUsersToGroupDto: AddUsersToGroupDto,
  ): Promise<ISuccessResponse> {
    const { userIds } = addUsersToGroupDto;

    await this.groupsService.addUsersToGroup(group.id, userIds);

    return {
      message: `users were successfully added to group with id ${group.id}`,
    };
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<IGroup> {
    try {
      const updatedGroup: IGroup = await this.groupsService.update(
        group.id,
        updateGroupDto,
      );
      return updatedGroup;
    } catch (error) {
      if (error instanceof NotUniqueError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }), GroupByIdPipe)
    group: IGroup,
  ): Promise<void> {
    return this.groupsService.delete(group.id);
  }
}
